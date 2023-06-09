import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(type => Int, { nullable: true, description: "The number of records to skip" })
  skip?: number;

  @Field(type => Int, { nullable: true, description: "The number of records to take" })
  take?: number;
}