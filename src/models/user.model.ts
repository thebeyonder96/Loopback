import {Entity, model, property} from '@loopback/repository';
import {INVALID_EMAIL, MAX_FIRST_NAME, MAX_LAST_NAME, MIN_FIRST_NAME, MIN_LAST_NAME, MIN_PASSWORD_LENGTH} from './error-messages';

export enum UserRole {
  USER,
  ADMIN,
  SUPER_ADMIN
}

export enum UserStatus {
  ACTIVE,
  INACTIVE,
  DELETED
}

@model()
export class User extends Entity {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 5,
      maxLength: 20,
      errorMessage: {
        minLength: MIN_FIRST_NAME,
        maxLength: MAX_FIRST_NAME
      }
    }
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 5,
      maxLength: 32,
      errorMessage: {
        minLength: MIN_LAST_NAME,
        maxLength: MAX_LAST_NAME
      }
    }
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
    unique: true,
    jsonSchema: {
      format: "email",
      default: 'example@gmail.com',
      errorMessage: {
        format: INVALID_EMAIL
      }
    }
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 8,
      errorMessage: {
        minLength: MIN_PASSWORD_LENGTH
      }
    }
  })
  password: string;

  @property({
    type: 'number',
    default: 0,
    jsonSchema: {
      enum: Object.values(UserRole),
      default: 0
    }
  })
  userRole: number;

  @property({
    type: 'number',
    default: 0,
    jsonSchema: {
      enum: Object.values(UserStatus),
      default: 0
    }
  })
  status: number

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;

