import bcrypt from 'bcrypt';
import { BaseEntity, BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from './Purchase';
import { PurchaseCategory } from './PurchaseCategory';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false })
    username!: string;

    @Column()
    password!: string;

    @OneToMany(type => Purchase, purchase => purchase.user)
    purchases!: Purchase[];

    @OneToMany(type => PurchaseCategory, category => category.user)
    categories!: PurchaseCategory[];

    @BeforeInsert()
    hashPassword = async () => {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

}
