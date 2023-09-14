import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateWatchHealthDatumDto {
    @IsNumber()
    @ApiProperty()
    value: number

    @IsString()
    @ApiProperty()
    type: string

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    code: number

    @IsString()
    @ApiProperty()
    @IsOptional()
    unit: string

    @IsString()
    @IsUUID('4')
    @ApiProperty()
    userId: string;
   
}
