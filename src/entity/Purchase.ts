import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PurchaseCategory } from './PurchaseCategory';
import { User } from './User';

@Entity()
export class Purchase extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: string;

  @Column({ type: 'float', scale: 6})
  amount!: number;

  @CreateDateColumn({type: 'date'})
  created_at!: Date;

  @UpdateDateColumn({ type: 'date' })
  updated_at!: Date;

  @ManyToOne(type => User, user => user.purchases)
  user!: User;

  @ManyToMany(type => PurchaseCategory)
  @JoinTable()
  categories!: PurchaseCategory[];

}