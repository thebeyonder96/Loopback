import {TokenService} from '@loopback/authentication';
import {MyUserService, TokenServiceBindings, UserRepository, UserServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import bcrypt from 'bcryptjs';
import {User} from '../models';
import {Meta} from '../models/meta.model';
import {LOGIN_SUCCESS, REGISTER_SUCCESS} from '../models/success-message';


export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE) private jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE) private userService: MyUserService,
    // @inject(SecurityBindings.USER) private user: UserProfile,
    @repository(UserRepository) private userRepository: UserRepository
  ) { }

  @post('/user/register')
  @response(200)
  async register(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {exclude: ['id', 'status', 'userRole']})
        }
      }
    }) user: Omit<User, 'id'>
  ) {
    try {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt)
      const USER = await this.userRepository.create(user)
      if (!USER) return new Error('Unable to register')
      return new Meta(REGISTER_SUCCESS)
    } catch (error) {
      throw error
    }
  }


  @post('/user/login')
  @response(200)
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {exclude: ['firstName', 'id', 'lastName', 'status', 'userRole']})
        }
      }
    }) user: loginUser
  ) {
    console.log(user);

    const EXISTING_USER = await this.userRepository.findOne({where: {email: user?.email}})
    if (EXISTING_USER) {
      const CHECK_PASSWORD = await bcrypt.compare(user.password, EXISTING_USER.password)
      if (!CHECK_PASSWORD) throw Error('Wrong Password')
      const {password, userRole, status, ...USER} = EXISTING_USER
      const userProfile = this.userService.convertToUserProfile(EXISTING_USER)
      const TOKEN = await this.jwtService.generateToken(userProfile)
      return new Meta(LOGIN_SUCCESS, TOKEN)
    }
  }
}

export interface loginUser {
  email: string;
  password: string
}
