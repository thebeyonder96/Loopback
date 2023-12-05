import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {TOKEN_GENERATE_FAIL} from '../configs/en';
import {UserRole} from '../models';

export class JwtService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private readonly jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private readonly jwtExpiresIn: string
  ) { }

  async generateToken(user: UserProfile): Promise<string> {
    if (!user) throw new HttpErrors.Unauthorized(TOKEN_GENERATE_FAIL)
    try {
      const token = jwt.sign(user, this.jwtSecret, {expiresIn: this.jwtExpiresIn});
      return token
    } catch (error) {
      throw new Error(error)
    }
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) throw new HttpErrors.Unauthorized('Authorization header missing');
    let userProfile: UserProfile;
    try {
      const DECRYPTED_TOKEN = jwt.verify(token, this.jwtSecret) as JwtPayload;
      userProfile = Object.assign({
        [securityId]: '',
        role: UserRole.USER
      }, {
        [securityId]: DECRYPTED_TOKEN.id,
        role: DECRYPTED_TOKEN.role
      })
      return userProfile;
    } catch (error) {
      throw Error(error)
    }
  }
}
