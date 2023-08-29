import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, IsUUID } from "class-validator";

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
    @IsOptional()
    @ApiProperty()
    avatar: string;
    
    @IsString()
    @ApiProperty()
    relation: string;
    
    @IsString()
    @IsUUID('4')
    @ApiProperty()
    userId: string

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isEmergency?: boolean;
}
