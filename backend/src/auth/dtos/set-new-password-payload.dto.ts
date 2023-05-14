import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../common/entities';
import { AuthenticationError } from '../../common/errors/authenticationError';
import { ResponseMessageDto } from '../../common/dtos/response-message.dto';

@ObjectType()
export class SetNewPasswordPayload extends ResponseMessageDto {
  @Field((type) => AuthenticationError, { nullable: true })
  error?: AuthenticationError;
}
