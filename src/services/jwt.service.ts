import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import jwt from 'jsonwebtoken';
import {TOKEN_GENERATE_FAIL} from '../configs/en';

export class JwtService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private readonly jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private readonly jwtExpiresIn: string
  ) { }

  async generateToken(user: UserProfile) {
    if (!user) throw new HttpErrors.Unauthorized(TOKEN_GENERATE_FAIL)
    try {
      const token = await jwt.sign(user, this.jwtSecret, {expiresIn: this.jwtExpiresIn});
      return token
    } catch (error) {
      throw new Error(error)
    }
  }

  async verifyToken() {

  }
}
