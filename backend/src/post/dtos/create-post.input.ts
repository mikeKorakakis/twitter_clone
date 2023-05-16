import { InputType, Int, Field } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class CreatePostInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  content?: JSON;

  @Field(() => Boolean)
  published: boolean;
}
