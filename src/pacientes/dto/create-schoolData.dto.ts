// dto para crear data de la escuela

import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

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
}