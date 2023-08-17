import { User } from "src/auth/entities";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Family {

    @PrimaryGeneratedColumn('uuid')
    id: string;
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
        unique: true
    })
    email: string;
    @Column('text', {
        nullable: false,
        unique: false
    })
    relation?: string;

    @Column('text', {
        default: null
    })
    avatar: string;

    @Column('boolean', {
        nullable: true,
        default: false
    })
    isVerified: boolean;

    @Column('boolean', {
        nullable: true,
        default: false
    })
    isEmergency: boolean;

    @ManyToOne(
        () => User,
        user => user.family,
        { onDelete: 'CASCADE' }
    )
    user: User

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
