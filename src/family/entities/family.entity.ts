import { User } from "src/auth/entities";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
        nullable: false,
        unique:true
    })
    email: string;
    @Column('text', {
        nullable: false,
        unique:true
    })
    relation?: string;

    @ManyToOne(
        () => User,
        user => user.family,
        { onDelete: 'CASCADE' }
    )
    user: User
}
