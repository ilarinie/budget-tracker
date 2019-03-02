import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from './Purchase';
import { UserAccount } from './UserAccount';

@Entity()
export class PurchaseCategory extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(type => UserAccount, user => user.categories, { nullable: false })
  user: UserAccount;

  @ManyToMany(type => Purchase, purchase => purchase.categories)
  purchases: Purchase[];

}