import { User } from "src/auth/entities";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WatchHealthDatum {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        nullable: true
    })
    code: string;

    @Column('text', {
        nullable: false
    })
    type: string;

     @Column('text', {
        nullable: true
    })
    unit: string;

    @Column('text', {
        nullable: false
    })
    value: string;
    
    @ManyToOne(() => User, user => user.watchHealthData)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

}
