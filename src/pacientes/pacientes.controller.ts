import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto} from './dto/update-paciente.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    // console.log(paginationDto);
    return this.pacientesService.findAll(paginationDto);
  }

  // * term = termino de busqueda (id, nombre o apellido, etc.)
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pacientesService.findOne( term );
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePacienteDto: UpdatePacienteDto) {
    return this.pacientesService.update(id, updatePacienteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.remove(id);
  }
}
