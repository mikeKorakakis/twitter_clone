import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../common/entities';

@ObjectType()
export class AuthPayload {
  @Field()
  user: User;

  @Field()
  accessToken: string;

}
