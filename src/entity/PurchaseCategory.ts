import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from './Purchase';
import { User } from './User';

@Entity()
export class PurchaseCategory extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToMany(type => Purchase, purchase => purchase.categories)
  @JoinTable()
  purchases!: Purchase[];

  @ManyToOne(type => User)
  user_id!: number;

}