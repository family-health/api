import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Family } from "src/family/entities";
import { WatchHealthDatum } from "src/health-data/entities";


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
        unique: false,
        nullable: false
    })
    email: string;

    @Column('text', {
        unique: false,
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

    @Column('double precision', {
        default: null
    })
    height: number;

    @Column('double precision', {
        default: null
    })
    weight: number;
    
    @Column('text', {
        default: null
    })
    gender: string;

    @Column('date', {
        default: null
    })
    birth: Date;
  

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

    @OneToMany(() => WatchHealthDatum, healthDatum => healthDatum.user)
    watchHealthData: WatchHealthDatum[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


    @BeforeInsert()
    checkFildsBeforeInserts() {
        this.email = this.email.toLocaleLowerCase().trim()
    }

    @BeforeUpdate()
    checkFildsBeforeUpdate() {
        this.email = this.email.toLocaleLowerCase().trim()
    }
}