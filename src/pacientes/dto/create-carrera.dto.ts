import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCarreraDto {
    
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @MinLength(3)
    @MaxLength(8)
    nomenclatura: string;
}