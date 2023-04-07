import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateFamilyDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    lastName: string;
    
    @IsString()
    @ApiProperty()
    phone: string;
    
    @IsString()
    @IsEmail()
    @ApiProperty()
    email: string;
    
    @IsString()
    @ApiProperty()
    relation: string;
    
    @IsString()
    @ApiProperty()
    userId: string
}