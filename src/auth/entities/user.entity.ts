import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        nullable: false
    })
    name: string;

    @Column('text', {
        nullable: false
    })
    lastname: string;

    @Column('text', {
        unique: true,
        nullable: false
    })
    username: string;

    @Column('text', {
        unique: true,
        nullable: false
    })
    email: string;

    @Column('text', {
        nullable: false
    })
    password: string;

    @Column('text', {
        default: null
    })
    avatar: string;


    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @Column('bool', {
        default: true,
    }
    )
    isActive: boolean

    @BeforeInsert()
    checkFildsBeforeInserts() {
        this.email = this.email.toLocaleLowerCase().trim()
    }

    @BeforeUpdate()
    checkFildsBeforeUpdate() {
        this.email = this.email.toLocaleLowerCase().trim()
    }
}