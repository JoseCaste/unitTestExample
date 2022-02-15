import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Document } from './document.entity';

@Entity("user")
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @OneToMany(() => Document, document => document.user)
    @JoinColumn()
    documents: Document[];
}