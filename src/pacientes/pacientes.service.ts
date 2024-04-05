import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PacientesService {


  private readonly logger = new Logger('PacientesService')
  
  //Nest ya traer el repositorio de la entidad paciente solo hay que inyectarlo en el constructor del servicio
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>
  ){}
  
  async create(createPacienteDto: CreatePacienteDto) {

    // usar el patron respository para manejar la base de datos
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
  findAll() {
    return this.pacienteRepository.find({});
  }

  async findOne(id: string) {

    const paciente = await this.pacienteRepository.findOneBy({ id });

    if(!paciente){
      throw new NotFoundException('Paciente no encontrado');
    }
    return paciente;
  }

  update(id: number, updatePacienteDto: UpdatePacienteDto) {
    return `This action updates a #${id} paciente`;
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
