import { PageMetaDtoParameters } from "../interfaces";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageMetaDto {
  @Field()
  readonly page: number;

  @Field()
  readonly take: number;

  @Field()
  readonly itemCount: number;

  @Field()
  readonly pageCount: number;

  @Field()
  readonly hasPreviousPage: boolean;

  @Field()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}