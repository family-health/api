import { User } from "src/auth/entities";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WatchHealthDatum {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('integer', {
        nullable: true
    })
    code: number;

    @Column('text', {
        nullable: false
    })
    type: string;

     @Column('text', {
        nullable: true
    })
    unit: string;

    @Column('integer', {
        nullable: false
    })
    value: number;
    
    @ManyToOne(() => User, user => user.watchHealthData)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

}
