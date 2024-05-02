import { Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested} from "class-validator";
import { CreateSchoolDataDto } from "./create-schoolData.dto";

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

    @IsString()
    @IsNotEmpty()
    @IsIn(['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Union Libre'])
    estadoCivil: string;

    @IsIn(['Masculino', 'Femenino', 'Otro'])
    genero: string;
    
    @IsString()
    @MinLength(10)
    @IsOptional()
    correoPer?: string;

    @ValidateNested()
    @Type(() => CreateSchoolDataDto)
    schoolData: CreateSchoolDataDto;
}