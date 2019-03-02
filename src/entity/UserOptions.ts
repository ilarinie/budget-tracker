import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserOptions extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  theme: string;

}