import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as IsUUID } from 'uuid';

@Injectable()
export class PacientesService {


  private readonly logger = new Logger('PacientesService')
  
  // * Nest ya traer el patron repositorio de la entidad, solo hay que inyectarlo en el constructor del servicio
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>
  ){}
  
  async create(createPacienteDto: CreatePacienteDto) {

    // * usar el patron respository para manejar la base de datos
    try {

      const paciente = this.pacienteRepository.create(createPacienteDto);
      await this.pacienteRepository.save(paciente);
      return paciente;
    
    }
    catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // TODO: Paginar los resultados
  findAll( paginationDto: PaginationDto ) {
    
    const { limit = 10, offset = 0 } = paginationDto;
    
    return this.pacienteRepository.find({
      take: limit,
      skip: offset

      // TODO relaciones
    });
  }

  async findOne(term: string) {

    let paciente: Paciente;

    // * Verificar si el termino de busqueda es un UUID o un correo o telefono
    if (IsUUID(term)) {
      paciente = await this.pacienteRepository.findOneBy({ id: term });
    } 
    else {
      paciente = await this.pacienteRepository.findOne({
        where: [
          { correoPer: term.toLowerCase() },
          { telefono: term },
        ],
      });
    }

    if(!paciente){
      throw new NotFoundException(`Paciente ${term} no encontrado`);
    }

    return paciente;
  }

  async update(id: string, updatePacienteDto: UpdatePacienteDto) {
    
    const paciente = await this.pacienteRepository.preload({
      id: id,
      ...updatePacienteDto
    });

    if(!paciente){
      throw new NotFoundException(`Paciente ${id} no encontrado`);
    }

    try {

      await this.pacienteRepository.save(paciente);
      return paciente;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    
    const paciente = await this.findOne(id);

    await this.pacienteRepository.remove(paciente);
  }


  // * Metodo para manejar las excepciones de la base de datos
  
  private handleDBExceptions(error: any){
    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error.message);
    throw new InternalServerErrorException('Error Inesperado en el servidor, revise los logs');
  }
}
