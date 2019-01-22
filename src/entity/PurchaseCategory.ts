import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from './Purchase';
import { User } from './User';

@Entity()
export class PurchaseCategory extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @ManyToOne(type => User, user => user.categories, { nullable: false })
  user!: User;

  @ManyToMany(type => Purchase, purchase => purchase.categories)
  purchases!: Purchase[];

}