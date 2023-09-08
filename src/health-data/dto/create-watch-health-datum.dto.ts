import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateWatchHealthDatumDto {
    @IsString()
    @ApiProperty()
    value: string

    @IsString()
    @ApiProperty()
    type: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    code: string

    @IsString()
    @ApiProperty()
    @IsOptional()
    unit: string

    @IsString()
    @IsUUID('4')
    @ApiProperty()
    userId: string;
   
}
