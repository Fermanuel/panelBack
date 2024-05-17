import { PartialType } from '@nestjs/mapped-types';
import { CreatePacienteDto } from './create-paciente.dto';
import { CreateSchoolDataDto } from './create-schoolData.dto';
import { CreateCarreraDto } from './create-carrera.dto';

export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {}