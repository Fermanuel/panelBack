import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { CreatePacienteDto, UpdatePacienteDto } from './dto/index';
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

  async create(createPacienteDto: CreatePacienteDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const schoolData = this.schoolDataRepository.create(createPacienteDto.schoolData);

        // Crear una nueva instancia de Carrera y guardarla
        const carrera = this.carreraRepository.create(createPacienteDto.schoolData.carrera);
        const savedCarrera = await queryRunner.manager.save(carrera);

        // Asociar la carrera con los datos de la escuela
        schoolData.carrera = savedCarrera;

        // Guardar schoolData
        const savedSchoolData = await queryRunner.manager.save(schoolData);

        // Crear paciente
        const paciente = this.pacienteRepository.create({
            ...createPacienteDto,
            schoolData: savedSchoolData,
        });

        await queryRunner.manager.save(paciente);

        await queryRunner.commitTransaction();
        return paciente;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        this.handleDBExceptions(error);
    } finally {
        await queryRunner.release();
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
      paciente = await this.pacienteRepository.findOneBy({ id: term });
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
    const { schoolData, ...toUpdate } = updatePacienteDto;

    // Busca el paciente existente
    const paciente = await this.pacienteRepository.findOne({ 
        where: { id }, 
        relations: ['schoolData', 'schoolData.carrera'] 
    });

    if (!paciente) {
        throw new NotFoundException(`Paciente ${id} no encontrado`);
    }

    // Inicia el query runner para la transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // Actualiza los datos del paciente
        queryRunner.manager.merge(Paciente, paciente, toUpdate);

        // Si schoolData se está actualizando
        if (schoolData) {
            // Actualiza los datos de schoolData si existen, si no, crea nuevos
            if (paciente.schoolData) {
                queryRunner.manager.merge(SchoolData, paciente.schoolData, schoolData);
            } else {
                const newSchoolData = this.schoolDataRepository.create(schoolData);
                paciente.schoolData = newSchoolData;
            }

            // Si carrera se está actualizando
            if (schoolData.carrera) {
                // Actualiza los datos de carrera si existen, si no, crea nuevos
                if (paciente.schoolData.carrera) {
                    queryRunner.manager.merge(Carrera, paciente.schoolData.carrera, schoolData.carrera);
                } else {
                    const newCarrera = this.carreraRepository.create(schoolData.carrera);
                    paciente.schoolData.carrera = newCarrera;
                }
            }
        }

        // Guarda todos los cambios
        await queryRunner.manager.save(paciente);
        if (paciente.schoolData) {
            await queryRunner.manager.save(paciente.schoolData);
            if (paciente.schoolData.carrera) {
                await queryRunner.manager.save(paciente.schoolData.carrera);
            }
        }

        await queryRunner.commitTransaction();

        paciente.nombre = paciente.nombre.toUpperCase();
        paciente.apellidoPaterno = paciente.apellidoPaterno.toUpperCase();
        paciente.apellidoMaterno = paciente.apellidoMaterno.toUpperCase();

        return paciente;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        this.handleDBExceptions(error);
    } finally {
        await queryRunner.release();
    }
}


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
