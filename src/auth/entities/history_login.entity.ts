import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class HistoryLogin {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        nullable: true,
        default:null
    })
    ua: string;

    @Column('text', {
        nullable: true,
        default:null
    })
    browser:string

    @Column('text', {
        nullable: true,
        default:null
    })
    os:string

    @Column()
    date: Date;

    @ManyToOne(
        () => User,
        user => user.history_login,
        { onDelete: 'CASCADE' }
    )
    user: User


}