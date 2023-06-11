import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';

export function PaginatedResult<T>(ItemType: Type<T>): any {
    
  @ObjectType({ isAbstract: true })
  abstract class PageClass {
    @IsArray()
    @Field(() => [ItemType], { nullable: true })
    readonly data: T[];

    @Field(() => PageMetaDto, { nullable: true })
    readonly meta: PageMetaDto;

    constructor(data: T[], meta: PageMetaDto) {
      this.data = data;
      this.meta = meta;
    }
  }
  return PageClass;
}
