import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateTweetInput {
    @Field(() => String!)
    content: string;
}