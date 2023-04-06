import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Family {

    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column('text', {
        nullable: false
    })
    name: string;
    @Column('text', {
        nullable: false
    })
    lastName: string;
    @Column('text', {
        nullable: false,
    })
    phone: string;
    @Column('text', {
        nullable: false
    })
    email: string;
    @Column('text', {
        nullable: false
    })
    relation?: string;
}
