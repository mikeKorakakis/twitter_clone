// import { ApiProperty } from '@nestjs/swagger'
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, NotContains, Length } from 'class-validator'

@InputType()
export class PasswordValuesDto {
    // @ApiProperty({
    //     required: true,
    //     example: 'demo123',
    // })
    @Field()
    @IsNotEmpty({
        message: 'Password cannot be empty or whitespace'
    })
    @NotContains(' ', {
        message: 'Password cannot be empty or whitespace'
    })
    @Length(6, 100, {
        message: 'Password must be between 6 and 100 characters long'
    })
    oldPassword: string

    // @ApiProperty({
    //     required: true,
    //     example: 'demo123',
    // })
    @Field()
    @IsNotEmpty({
        message: 'Password cannot be empty or whitespace'
    })
    @NotContains(' ', {
        message: 'Password cannot be empty or whitespace'
    })
    @Length(6, 100, {
        message: 'Password must be between 6 and 100 characters long'
    })
    newPassword: string
}