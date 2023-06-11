import { Field, ObjectType } from '@nestjs/graphql';
import { UserError } from '../../common/errors/userError';

@ObjectType()
export class FollowUserPayload {
  @Field((type) => Boolean, { nullable: true })
  success: Boolean;

  @Field((type) => UserError, { nullable: true })
  error?: UserError;

  constructor({ success, error }: { success: Boolean; error?: UserError }) {
    this.success = success;
    this.error = error;
  }
}
