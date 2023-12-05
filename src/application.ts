import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {JWTAuthenticationComponent, MyUserService, TokenServiceBindings, UserServiceBindings} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {TokenServiceConstants} from './configs/key';
import {MySequence} from './sequence';
import {JwtService} from './services';
import {JwtStrategy} from './strategies/jwt-strategy';

export {ApplicationConfig};

export class CryptopassApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.component(AuthenticationComponent)
    registerAuthenticationStrategy(this, JwtStrategy)
    this.component(JWTAuthenticationComponent)
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService)
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_KEY as string)
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN)
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JwtService)

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
