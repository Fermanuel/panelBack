// dto para crear data de la escuela

import { IsIn, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { CreateCarreraDto } from "./create-carrera.dto";
import { Type } from "class-transformer";

export class CreateSchoolDataDto {

    @IsString()
    @MinLength(8)
    @MaxLength(8)
    @IsOptional()
    noControl?: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    noSemestre?: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    correoTec?: string;

    @IsIn(['Unidad Tomas Aquino', 'Unidad Otay'])
    @IsOptional()
    plantel?: string;

    @ValidateNested()
    @Type(() => CreateCarreraDto)
    carrera: CreateCarreraDto;
}