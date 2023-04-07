import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    phone: string

    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    lastname: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    avatar: string;
}
