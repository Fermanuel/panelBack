import { Module } from '@nestjs/common';
import { CarrerasTecService } from './carreras-tec.service';
import { CarrerasTecController } from './carreras-tec.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrerasTec } from './entities/carreras-tec.entity';

@Module({
  controllers: [CarrerasTecController],
  providers: [CarrerasTecService],

  imports: [
    // Import the TypeOrmModule
    TypeOrmModule.forFeature([CarrerasTec]),
  ]
})
export class CarrerasTecModule {}
