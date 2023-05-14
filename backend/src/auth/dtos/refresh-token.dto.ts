import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class RefreshTokenDto {
  @Field()
  @IsNotEmpty({
    message: 'Refresh token cannot be empty or whitespace',
  })
  refreshToken: string;
}
