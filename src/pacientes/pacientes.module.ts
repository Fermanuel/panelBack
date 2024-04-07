import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente, SchoolData } from './entities';


@Module({
  controllers: [PacientesController],
  providers: [PacientesService],
  imports: [
    TypeOrmModule.forFeature([Paciente, SchoolData]),
  ],
})
export class PacientesModule {}
