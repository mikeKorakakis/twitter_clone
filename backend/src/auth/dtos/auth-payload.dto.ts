import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../common/entities';
import { AuthenticationError } from '../../common/errors/authenticationError';

@ObjectType()
export class AuthPayload {
  @Field((type) => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  accessToken?: string;

  @Field((type) => AuthenticationError, { nullable: true })
  error?: AuthenticationError;
}
