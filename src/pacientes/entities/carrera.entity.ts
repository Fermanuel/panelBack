import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SchoolData } from "./school-data.entity";

@Entity('carrera')
export class Carrera {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text',{
        unique: true,
        nullable: false,        
    })
    nombre: string;

    @Column('text',{
        unique: true,
        nullable: false,
    })
    nomenclatura: string;

    @OneToOne(
        () => SchoolData, 
        (schooldata) => schooldata.carrera,
        { onDelete: 'CASCADE' } // Add this line to enable cascade deletion
    )
    @JoinColumn()
    schoolData: SchoolData;
}