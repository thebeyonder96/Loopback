import {AuthenticationStrategy} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {HttpErrors, RedirectRoute, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {AUTHORIZATION_HEADER_NOT_FOUND, INVALID_AUTH_HEADER} from '../models/error-messages';
import {JwtService} from '../services';

export class JwtStrategy implements AuthenticationStrategy {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    private jwtService: JwtService,
  ) { }
  name: string = 'jwt';
  async authenticate(request: Request): Promise<UserProfile | RedirectRoute | undefined> {
    const TOKEN = this.extractCredentials(request);
    if (!TOKEN) throw new Error(AUTHORIZATION_HEADER_NOT_FOUND)
    console.log(TOKEN);
    const USER_PROFILE = await this.jwtService.verifyToken(TOKEN);
    return Promise.resolve(USER_PROFILE)
  }

  extractCredentials(request: Request): string {
    try {
      if (!request.headers.authorization) throw new Error(AUTHORIZATION_HEADER_NOT_FOUND)
      // authorization : Bearer xxx..yy.cc
      const AUTH_HEADER = request.headers.authorization
      if (!AUTH_HEADER.startsWith('Bearer')) throw new Error(INVALID_AUTH_HEADER)
      const PARTS = AUTH_HEADER.split(' ');

      const TOKEN = PARTS[1]
      console.log(TOKEN);
      return TOKEN;
    } catch (error) {
      throw new HttpErrors.Unauthorized(error.message)
    }
  }
}
