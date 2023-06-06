import { AuthenticationError } from '@nestjs/apollo';
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../common/entities';
import { UserError } from '../../common/errors/userError';

@ObjectType()
export class UpdateUserPayload {
 
  @Field((type) => Boolean, { nullable: true })
  success: Boolean;

  @Field((type) => UserError, { nullable: true })
  error?: UserError;

  constructor({ success, error }: { success: Boolean; error?: UserError }) {
    this.success = success;
    this.error = error;
  }
}
