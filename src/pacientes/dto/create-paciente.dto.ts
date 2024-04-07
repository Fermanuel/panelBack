import { IsArray, IsIn, IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class CreatePacienteDto {

    @IsString()
    @MinLength(1)
    nombre: string;

    @IsString()
    @MinLength(1)
    apellidoPaterno: string;

    @IsString()
    @MinLength(1)
    apellidoMaterno: string;
    
    @IsString()
    @MinLength(10)
    @IsOptional()
    cumple?: string;

    @IsString()
    @MinLength(5)
    @IsOptional()
    direccion?: string;
    
    @IsString()
    @MinLength(10)
    telefono: string;

    @IsIn(['Masculino', 'Femenino', 'Otro'])
    genero: string;
    
    @IsString()
    @MinLength(10)
    @IsOptional()
    correoPer?: string;
}


// dto para crear data de la escuela

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
    correTec: string;

    @IsIn(['Unidad Tomas Aquino', 'Unidad Otay'])
    plantel: string;

    // carrera
}