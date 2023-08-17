import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    phone: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastname: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    avatar: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    height: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    weight: number;
    
    @ApiProperty()
    @IsString()
    @IsIn(['M', 'F'])
    @IsNotEmpty()
    gender: string;

    @ApiProperty()
    @IsNotEmpty()
    birth: Date;
}
