import { IsNumber, Length, Max, Min } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PurchaseCategory } from './PurchaseCategory';
import { User } from './User';

@Entity()
export class Purchase extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Length(3, 50)
  @Column({ nullable: false })
  description!: string;

  @IsNumber()
  @Min(0, {
    message: 'Amount must be over 0'
  })
  @Column({ type: 'float', scale: 6, nullable: false})
  amount!: number;

  @CreateDateColumn({type: 'timestamp', nullable: false })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false})
  updated_at!: Date;

  @ManyToOne(type => User, user => user.purchases, { nullable: false })
  user!: User;

  @ManyToMany(type => PurchaseCategory, category => category.purchases)
  @JoinTable()
  categories!: PurchaseCategory[];

}