// dto para crear data de la escuela

import { IsIn, IsString, MaxLength, MinLength } from "class-validator";

export class CreateSchoolDataDto {

    @IsString()
    @MinLength(8)
    @MaxLength(8)
    noControl: string;

    @IsString()
    @MinLength(1)
    noSemestre: string;

    @IsString()
    @MinLength(1)
    correoTec: string;

    @IsIn(['Unidad Tomas Aquino', 'Unidad Otay'])
    plantel: string;
}