// import { ApiProperty } from '@nestjs/swagger'
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, NotContains, Length, Matches, IsEmail } from 'class-validator'

@InputType()

export class CreateAccountDto {

    // @ApiProperty({
    //     required: true,
    //     example: 'demo@demo.com',
    // })
    @Field()

    @IsNotEmpty({
        message: 'Email cannot be empty or whitespace'
    })
    @IsEmail({}, {
        message: 'Email should be email'
    })
    email: string


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
    password: string


    // @ApiProperty({
    //     required: true,
    //     example: 'John',
    // })
    @Field()
    @IsNotEmpty({
        message: 'First name cannot be empty or whitespace'
    })
    @Length(2, 30, {
        message: 'First name must be between 3 and 30 characters long'
    })
    firstName: string


    // @ApiProperty({
    //     required: true,
    //     example: 'Doe',
    // })
    @Field()
    @IsNotEmpty({
        message: 'Last name cannot be empty or whitespace'
    })
    @Length(3, 50, {
        message: 'Last name must be between 3 and 50 characters long'
    })
    lastName: string

    // @ApiProperty({
    //     required: true,
    //     example: 'JohnDoe2137',
    // })
    @Field()
    @IsNotEmpty({
        message: 'Display name cannot be empty or whitespace'
    })
    @Length(3, 50, {
        message: 'Display name must be between 3 and 30 characters long'
    })
    @Matches(/^[\w](?!.*?\.{2})[\w. ]{1,30}[\w]$/, {
        message: "Display name can include only letters, numbers and space between words and be max 30 characters long"
    })
    displayName: string
}
