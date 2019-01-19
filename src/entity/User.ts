import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from './Purchase';
import { PurchaseCategory } from './PurchaseCategory';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    displayName!: string;

    @OneToMany(type => Purchase, purchase => purchase.user)
    purchases!: Purchase[];

    @OneToMany(type => PurchaseCategory, category => category.user_id)
    categories!: PurchaseCategory[];

}
