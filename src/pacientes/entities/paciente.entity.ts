import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Paciente {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    NoControl: string;

    @Column('text')
    Nombre: string;

    @Column('text')
    ApellidoPaterno: string;

    @Column('text')
    ApellidoMaterno: string;

    @Column('date')
    cumple: Date;

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
    })
    correoTec: string;

    @Column('text', {
        unique: true,
        nullable: true,
    })
    correoPer: string;

    @Column('date', {
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;
}
