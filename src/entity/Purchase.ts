import { IsNumber, Length, Max, Min } from 'class-validator';
import { BaseEntity, BeforeInsert, Column, ColumnOptions, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PurchaseCategory } from './PurchaseCategory';
import { UserAccount } from './UserAccount';

@Entity()
export class Purchase extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Length(3, 50)
  @Column({ nullable: false })
  description: string;

  @IsNumber()
  @Min(0, {
    message: 'Amount must be over 0'
  })
  @Column({ type: 'float', scale: 6, nullable: false})
  amount: number;

  @Column({type: 'timestamp', nullable: false})
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updated_at: Date;

  @ManyToOne(type => UserAccount, user => user.purchases, { nullable: false })
  @JoinColumn({name: 'user_id'})
  user: UserAccount;

  user_id: string;

  @ManyToMany(type => PurchaseCategory, category => category.purchases)
  @JoinTable()
  categories: PurchaseCategory[];

  @BeforeInsert()
  creationDate = () => {
    this.created_at = new Date();
  }

}