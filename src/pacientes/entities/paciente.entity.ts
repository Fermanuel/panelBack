import { BeforeInsert, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SchoolData } from "./index";

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

    //datos de la escuela
    @OneToOne(() => SchoolData, (schooldata) => schooldata.paciente)
    schoolData: SchoolData;
    
    //doctor

    @BeforeInsert()
    Mayusculas(){
        this.nombre = this.nombre.toUpperCase();
        this.apellidoPaterno = this.apellidoPaterno.toUpperCase();
        this.apellidoMaterno = this.apellidoMaterno.toUpperCase();
    }
}
