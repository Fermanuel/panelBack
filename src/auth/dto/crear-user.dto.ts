import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreatUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener una letra mayúscula, minúscula y un número',
  })
  password: string;

  @IsString()
  nombre: string;

  @IsString()
  apellido: string;
}