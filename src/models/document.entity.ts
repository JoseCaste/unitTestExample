import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("document")
export class Document{

    @PrimaryGeneratedColumn()
    id_document:number;

    @Column()
    name:string;

    @Column()
    type:string;

    @ManyToOne(() => User, user => user.documents)
    @JoinColumn({name:'user_id'})
    user: User;
    
}