import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Family } from "src/family/entities";

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
    email: string;

    @Column('text', {
        unique: true,
        nullable: false
    })
    phone: string;


    @Column('text', {
        select: false,
        nullable: false
    })
    password: string

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

    @OneToMany(
        () => Family,
        family => family.user,
        { cascade: true, eager: true }
    )
    family?: Family[]

    @BeforeInsert()
    checkFildsBeforeInserts() {
        this.email = this.email.toLocaleLowerCase().trim()
    }

    @BeforeUpdate()
    checkFildsBeforeUpdate() {
        this.email = this.email.toLocaleLowerCase().trim()
    }
}