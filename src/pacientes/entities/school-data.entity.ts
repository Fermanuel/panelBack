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
    semestre: string;

    @Column('text', {
        unique: true,
        nullable: false
    })
    correoTec: string;

    @IsIn(['Tomas Aquino', 'Otay'])
    plantel: string;

    @OneToOne(() => Paciente, (paciente) => paciente.schoolData)
    paciente: Paciente;
}