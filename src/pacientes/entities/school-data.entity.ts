import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Paciente } from "./index";
import { IsIn } from "class-validator";

@Entity()
export class SchoolData {


    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {
        unique: true
    })
    noControl: string;

    @Column('text')
    noSemestre: string;

    @Column('text', {
        unique: true,
        nullable: false
    })
    correoTec: string;

    @IsIn(['Tomas Aquino', 'Otay'])
    plantel: string;

    // 1:1 relacion con Paciente
    @OneToOne(() => Paciente, (paciente) => paciente.schoolData)
    paciente: Paciente;
}