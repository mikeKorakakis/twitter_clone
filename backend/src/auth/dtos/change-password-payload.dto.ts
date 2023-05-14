import { Field, ObjectType } from '@nestjs/graphql';
import { AuthenticationError } from '../../common/errors/authenticationError';
import { ResponseMessageDto } from '../../common/dtos/response-message.dto';

@ObjectType()
export class ChangePasswordPayload extends ResponseMessageDto {
  @Field((type) => AuthenticationError, { nullable: true })
  error?: AuthenticationError;
}
