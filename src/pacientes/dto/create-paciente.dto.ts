import { IsIn, IsOptional, IsString, MinLength } from "class-validator";

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
