import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class CreateWatchHealthDatumDto {
    @IsString()
    @ApiProperty()
    value: string

    @IsString()
    @ApiProperty()
    type: string

    @IsString()
    @IsUUID('4')
    @ApiProperty()
    userId: string;
   
}
