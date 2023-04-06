import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    @Type(()=>Number)
    limit?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(()=>Number)
    offset?: number
}