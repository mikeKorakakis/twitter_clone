import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(Order, {
  name: 'Order',
});

@InputType()
export class PageOptionsDto {
  @Field(() => Order, { nullable: true })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @Field({ nullable: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Field()
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  @Field()
  get skip(): number {
    console.log(this.page, this.take)
    return (this.page - 1) * this.take;
  }
}
