import { ObjectType, Field } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';

export enum AuthenticationErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NICKNAME_EXISTS = 'NICKNAME_EXISTS',
  EMAIL_EXISTS = 'EMAIL_EXISTS',
  EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  REGISTERED_WITH_SOCIAL = 'REGISTERED_WITH_SOCIAL',
  // Add more error types as needed
}

registerEnumType(AuthenticationErrorType, {
    name: 'AuthenticationErrorType',
  });


@ObjectType()
export class AuthenticationError {
  @Field()
  message: string;

  @Field()
  time: Date;

  @Field(() => AuthenticationErrorType)
  type: AuthenticationErrorType;

  constructor({
    message,
    type,
  }: {
    message: string;
    type: AuthenticationErrorType;
  }) {
    this.message = message;
    this.type = type;
    this.time = new Date();
  }
}
