import { User } from "src/auth/entities";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WatchHealthDatum {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        nullable: false
    })
    value: string;

    @Column('text', {
        nullable: false
    })
    type: string;
    
    @ManyToOne(() => User, user => user.watchHealthData)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

}
