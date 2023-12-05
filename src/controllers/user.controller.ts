import {TokenService, authenticate} from '@loopback/authentication';
import {MyUserService, TokenServiceBindings, UserRepository, UserServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody, response} from '@loopback/rest';
import bcrypt from 'bcryptjs';
import {User, UserRole} from '../models';
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
    @requestBody() user: Omit<User, 'id'>
  ) {
    try {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt)
      const USER = await this.userRepository.create(user)
      if (!USER) return new Error('Unable to register')
      const userProfile = this.userService.convertToUserProfile(USER)
      const TOKEN = await this.jwtService.generateToken(userProfile)
      return new Meta(REGISTER_SUCCESS, TOKEN)
    } catch (error) {
      throw error
    }
  }

  @authenticate({
    strategy: "jwt",
    options: {required: Object.values(UserRole)}
  })
  @post('/user/login')
  @response(200)
  async login(
    @requestBody() user: loginUser
  ) {
    const EXISTING_USER = await this.userRepository.findOne({where: {email: user?.email}})
    if (EXISTING_USER) {
      const CHECK_PASSWORD = await bcrypt.compare(user.password, EXISTING_USER.password)
      if (!CHECK_PASSWORD) throw Error('Wrong Password')
      const {password, userRole, status, ...USER} = EXISTING_USER
      return new Meta(LOGIN_SUCCESS, USER)
    }
  }
}

export interface loginUser {
  email: string;
  password: string
}
