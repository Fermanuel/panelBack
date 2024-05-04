import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("carreras_tec")
export class CarrerasTec {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    nombre: string;

    @Column('text', {
        nullable: true
    })
    nomenclatura: string;
}
