import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { CreatePacienteDto, UpdatePacienteDto, CreateSchoolDataDto } from './dto/index';
import {  Carrera, Paciente, SchoolData } from './entities';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as IsUUID } from 'uuid';


@Injectable()
export class PacientesService {
  private readonly logger = new Logger('PacientesService');

  // * Nest ya traer el patron repositorio de la entidad, solo hay que inyectarlo en el constructor del servicio
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,

    @InjectRepository(SchoolData)
    private readonly schoolDataRepository: Repository<SchoolData>,

    @InjectRepository(Carrera)
    private readonly carreraRepository: Repository<Carrera>,

    private readonly dataSource: DataSource,
  ) {}

  // * usar el patron respository para manejar la base de datos
  async create(createPacienteDto: CreatePacienteDto) {
    
    try {
      
      const schoolData = this.schoolDataRepository.create(
        createPacienteDto.schoolData,
      );

      // * Crear una nueva instancia de Carrera y guardarla
      const carrera = this.carreraRepository.create(createPacienteDto.schoolData.carrera);
      const savedCarrera = await this.carreraRepository.save(carrera);

      // * Asociar la carrera con los datos de la escuela
      schoolData.carrera = savedCarrera;

      await this.schoolDataRepository.save(schoolData);

      const paciente = this.pacienteRepository.create({
        ...createPacienteDto,
        schoolData: schoolData,
      });

      await this.pacienteRepository.save(paciente);

      return paciente;
    } 
    catch (error) {
      
      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.pacienteRepository.find({
      take: limit,
      skip: offset,

      relations: ['schoolData', 'schoolData.carrera'],
    });
  }

  async findOne(term: string) {
    let paciente: Paciente;

    // * Verificar si el termino de busqueda es un UUID o un correo o telefono
    if (IsUUID(term)) {

      paciente = await this.pacienteRepository.findOneBy({ id: term,  });

    } else {
      paciente = await this.pacienteRepository.findOne({
        where: [{ correoPer: term.toLowerCase() }, { telefono: term }],

        relations: ['schoolData', 'schoolData.carrera'],
      });
    }

    if (!paciente) {
      throw new NotFoundException(`Paciente ${term} no encontrado`);
    }

    return paciente;
  }


  async update(id: string, updatePacienteDto: UpdatePacienteDto) {
    
    const paciente = await this.pacienteRepository.findOneBy({ id: id });
  
    if (!paciente) {
      throw new NotFoundException(`Paciente ${id} no encontrado`);
    }
  
    // Actualizar las propiedades del paciente
    Object.assign(paciente, updatePacienteDto);

    // Actualizar las propiedades de SchoolData
    if (updatePacienteDto.schoolData) {
      Object.assign(paciente.schoolData, updatePacienteDto.schoolData);
    }
  
    // Actualizar la entidad Carrera si se proporciona en el DTO
    if (updatePacienteDto.schoolData && updatePacienteDto.schoolData.carrera) {
      
      const carrera = await this.carreraRepository.findOne({ where: { id: paciente.schoolData.carrera.id } });
      
      if (carrera) {
        
        Object.assign(carrera, updatePacienteDto.schoolData.carrera);

        await this.carreraRepository.save(carrera);
      }
    }
  
    // Guardar la entidad Paciente actualizada
    await this.pacienteRepository.save(paciente);
  
    return paciente;
  }


  // async update(id: string, updatePacienteDto: UpdatePacienteDto) {

  //   const {schoolData, ...toUpdata } = updatePacienteDto;

  //   const paciente = await this.pacienteRepository.preload({
  //     id: id,
  //     ...toUpdata,
  //     schoolData: schoolData
      
  //   });


  //   if(!paciente){
  //     throw new NotFoundException(`Paciente ${id} no encontrado`);
  //   }

  //   // crear query runner para actualizar la tabla schoolData
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {

  //     if (schoolData) {

  //       await queryRunner.manager.update(SchoolData, { paciente: id }, schoolData);

  //       await queryRunner.manager.save(paciente);
  //       await queryRunner.commitTransaction();

  //     }

  //     // ? conviento los campos de nombre, apellidoPaterno y apellidoMaterno a mayusculas
  //     paciente.nombre = paciente.nombre.toUpperCase();
  //     paciente.apellidoPaterno = paciente.apellidoPaterno.toUpperCase();
  //     paciente.apellidoMaterno = paciente.apellidoMaterno.toUpperCase();

  //     return paciente;

  //   } 
  //   catch (error) {

  //     await queryRunner.rollbackTransaction();
  //     this.handleDBExceptions(error);

  //   } 
  //   finally {
  //     await queryRunner.release();
  //   }
  // }

  async remove(id: string) {
    const paciente = await this.findOne(id);
    

    await this.pacienteRepository.remove(paciente);
  }

  // * Metodo para manejar las excepciones de la base de datos

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error.message);
    throw new InternalServerErrorException(
      'Error Inesperado en el servidor, revise los logs',
    );
  }
}
