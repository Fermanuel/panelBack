import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente, SchoolData } from './entities';
import { Carrera } from './entities/carrera.entity';


@Module({
  controllers: [PacientesController],
  providers: [PacientesService],
  imports: [
    TypeOrmModule.forFeature([Paciente, SchoolData, Carrera]),
  ],
})
export class PacientesModule {}
