import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false
    })
    password: string;

    @Column('text')
    nombre: string;

    @Column('text')
    apellido: string;

    @Column('bool', {
        default: true
    })
    esActivo: boolean;

    @Column('text', {
        array: true,
        default: ['doctor']
    })
    roles: string[]

    @BeforeInsert()
    checkEmail() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkEmailOnUpdate() {
        this.checkEmail();
    }

}
