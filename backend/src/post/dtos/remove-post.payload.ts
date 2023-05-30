import { AuthenticationError } from '@nestjs/apollo';
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../common/entities';
import { PostError } from '../../common/errors/postError';

@ObjectType()
export class RemovePostPayload {
  @Field((type) => Boolean, { nullable: true })
  success: Boolean;

  @Field((type) => PostError, { nullable: true })
  error?: PostError;

  constructor({ success, error }: { success: Boolean; error?: PostError }) {
    this.success = success;
    this.error = error;
  }
}
