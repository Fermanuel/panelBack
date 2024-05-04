import { Controller, Get} from '@nestjs/common';
import { CarrerasTecService } from './carreras-tec.service';


@Controller('carreras-tec')
export class CarrerasTecController {
  constructor(private readonly carrerasTecService: CarrerasTecService) {}

  @Get()
  findAll() {
    return this.carrerasTecService.findAll();
  }
}
