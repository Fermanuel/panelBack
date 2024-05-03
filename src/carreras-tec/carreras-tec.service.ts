import { Injectable } from '@nestjs/common';
import { CarrerasTec } from './entities/carreras-tec.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class CarrerasTecService {

  constructor(
    
    @InjectRepository(CarrerasTec)
    private readonly carrerasTecRepository: Repository<CarrerasTec>,

  ) {}


  findAll() {
    return this.carrerasTecRepository.find();
  }
}
