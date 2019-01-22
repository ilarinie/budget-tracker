import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PurchaseCategory } from './PurchaseCategory';
import { User } from './User';

@Entity()
export class Purchase extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ nullable: false })
  description!: string;

  @Column({ type: 'float', scale: 6, nullable: false})
  amount!: number;

  @CreateDateColumn({type: 'date', nullable: false })
  created_at!: Date;

  @UpdateDateColumn({ type: 'date', nullable: false})
  updated_at!: Date;

  @ManyToOne(type => User, user => user.purchases, { nullable: false })
  user!: User;

  @ManyToMany(type => PurchaseCategory, category => category.purchases)
  @JoinTable()
  categories!: PurchaseCategory[];

}