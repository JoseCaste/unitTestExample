import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('document')
export class Document {
  @PrimaryGeneratedColumn()
  id_document: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  fk_id_user: number;
}
