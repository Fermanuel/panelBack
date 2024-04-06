import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';

@Module({
  controllers: [PacientesController],
  providers: [PacientesService],
  imports: [
    TypeOrmModule.forFeature([Paciente]),
  ],
})
export class PacientesModule {}
