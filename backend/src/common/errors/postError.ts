import { ObjectType, Field } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';

export enum PostErrorType {
  NOT_USER_POST = 'NOT_USER_POST',
  MAX_POST_REACHED = 'MAX_POST_REACHED',
  
}

registerEnumType(PostErrorType, {
    name: 'PostErrorType',
  });


@ObjectType()
export class PostError {
  @Field()
  message: string;

  @Field()
  time: Date;

  @Field(() => PostErrorType)
  type: PostErrorType;

  constructor({
    message,
    type,
  }: {
    message: string;
    type: PostErrorType;
  }) {
    this.message = message;
    this.type = type;
    this.time = new Date();
  }
}
