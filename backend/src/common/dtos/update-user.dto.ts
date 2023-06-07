// import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length, Matches } from 'class-validator'
import {Field, InputType} from '@nestjs/graphql'

@InputType()
export class UpdateUserDto {

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
