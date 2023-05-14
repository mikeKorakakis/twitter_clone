import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class ResponseMessageDto {
  @Field((type) => String, { nullable: true })
  message?: string;

  @Field((type) => Boolean, { nullable: true })
  success?: boolean;

  constructor({ message, success }: { message: string; success: boolean }) {
    this.message = message;
    this.success = success;
  }
}
