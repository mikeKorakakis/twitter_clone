import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RefreshTokenInput {
  @Field()
  refresh_token: string;
}
