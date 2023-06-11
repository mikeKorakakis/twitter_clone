import { ObjectType, Field } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';

export enum UserErrorType {
    EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
    DISPLAY_NAME_ALREADY_EXISTS = 'DISPLAY_NAME_ALREADY_EXISTS',
    CANNOT_FOLLOW_YOUSELT = 'CANNOT_FOLLOW_YOUSELT',
    CANNOT_UNFOLLOW_YOUSELT = 'CANNOT_UNFOLLOW_YOUSELT',
    USER_NOT_FOUND = 'USER_NOT_FOUND'
}
//   NOT_USER_POST = 'NOT_USER_POST',
//   MAX_POST_REACHED = 'MAX_POST_REACHED',

registerEnumType(UserErrorType, {
  name: 'UserErrorType',
});

@ObjectType()
export class UserError {
  @Field()
  message: string;

  @Field()
  time: Date;

  @Field(() => UserErrorType)
  type: UserErrorType;

  constructor({ message, type }: { message: string; type: UserErrorType }) {
    this.message = message;
    this.type = type;
    this.time = new Date();
  }
}
