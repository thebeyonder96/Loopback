import {UserService} from '@loopback/authentication';
import {Principal, securityId} from '@loopback/security';
import {User} from '../models';


export interface UserProfile extends Principal {
  [securityId]: string;
  [attribute: string]: any;
}

export type UserType = {
  id: string;
  role?: number;
}

export type Credentials = {
  email: string;
  password: string;
}
export class CustomUserService implements UserService<User, Credentials>{
  constructor() { }
  async verifyCredentials(credentials: Credentials): Promise<any> {
    return {};
  }

  convertToUserProfile(user: User): UserProfile {
    return {
      name: user.firstName,
      [securityId]: user.id as string,
      id: user.id,
      role: user.userRole
    }
  }

}
