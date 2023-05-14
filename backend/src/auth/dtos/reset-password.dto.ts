import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseMessageDto } from '../../common/dtos/response-message.dto';

@ObjectType()
export class ResetPasswordDto extends ResponseMessageDto {
  @Field()
  email: string;

//   @Field()
//   success: boolean;

//   @Field()
//   message: string;
}
