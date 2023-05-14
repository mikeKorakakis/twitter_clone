import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length, NotContains } from 'class-validator';

@InputType()
export class SetNewPasswordDto {
  @Field()
  @IsNotEmpty({
    message: 'Password cannot be empty or whitespace',
  })
  @NotContains(' ', {
    message: 'Password cannot be empty or whitespace',
  })
  @Length(6, 100, {
    message: 'Password must be between 6 and 100 characters long',
  })
  newPassword: string;

  @Field()
  @IsNotEmpty({
    message: 'token cannot be empty or whitespace',
  })
  token: string;
}
