import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Paciente } from "./index";

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

    @Column('text')
    plantel: string;

    // 1:1 relacion con Paciente
    @OneToOne(
        () => Paciente, 
        (paciente) => paciente.schoolData,
        { onDelete: 'CASCADE' } // Add this line to enable cascade deletion
    )
    @JoinColumn({name: 'paciente_data'})
    paciente: Paciente;
}