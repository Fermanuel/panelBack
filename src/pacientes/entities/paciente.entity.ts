import { IsDate, IsDateString } from "class-validator";
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Paciente {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: string;

    @Column('text')
    apellidoPaterno: string;

    @Column('text')
    apellidoMaterno: string;

    @Column('text', {
        nullable: true,
    })
    cumple: string;

    @Column('text', {
        nullable: true,
    })
    direccion: string;

    @Column('text', {
        unique: true,
    })
    telefono: string;

    @Column('text', {
        unique: true,
        nullable: true,
    })
    correoPer: string;

    @Column('text')
    genero: string;

    @CreateDateColumn()
    created_at: Date;

    // historialAcademico;
    // No. de sesiones
    //doctor

    @BeforeInsert()
    Mayusculas(){
        this.nombre = this.nombre.toUpperCase();
        this.apellidoPaterno = this.apellidoPaterno.toUpperCase();
        this.apellidoMaterno = this.apellidoMaterno.toUpperCase();
    }
}
