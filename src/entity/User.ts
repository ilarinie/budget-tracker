import bcrypt from 'bcrypt';
import { Length } from 'class-validator';
import { BaseEntity, BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn, getConnection } from 'typeorm';
import { Purchase } from './Purchase';
import { PurchaseCategory } from './PurchaseCategory';
import { lastPayDate } from '../utils/DateUtils';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Length(3, 20)
    @Column({ nullable: false })
    username: string;

    @Column()
    password: string;

    @Column({ name: 'monthly_income', nullable: true })
    monthlyIncome: number;

    @Column({ name: 'pay_date', nullable: true})
    payDate: number;

    @OneToMany(type => Purchase, purchase => purchase.user)
    purchases: Purchase[];

    @OneToMany(type => PurchaseCategory, category => category.user)
    categories: PurchaseCategory[];

    @BeforeInsert()
    hashPassword = async () => {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    total: number;

    monthlyPurchases: Purchase[];

    monthlyTotal: number;

    monthlyRemaining: number;

    monthlyExpandableIncome: number;

    public populateTotal = async () => {
        const result: { sum: number } = await Purchase.createQueryBuilder().select('sum(amount)').where('user_id = :id', { id: this.id }).getRawOne();
        this.total = result.sum;
        return result.sum;
    }

    public populateMonthlyPurchases = async (): Promise<Purchase[]> => {
        if (!this.payDate) {
            return Promise.resolve([]);
        }
        const dateString = lastPayDate(this.payDate).toUTCString();
        const purchases =  await Purchase.createQueryBuilder().select('*').where('user_id = :id', { id: this.id }).andWhere('created_at > :date', { date: dateString }).getMany();
        this.monthlyPurchases = purchases;
        return Promise.resolve(purchases);
    }

    public populateMonthlyTotals = async (): Promise<{ monthlyTotal: number, monthlyRemaining: number}> => {
        if (!this.payDate) {
            return Promise.reject("Pay date not set");
        }
        const dateString = lastPayDate(this.payDate).toUTCString();
        const result = await Purchase.createQueryBuilder().select('sum(amount)').where('user_id  = :id', { id: this.id }).andWhere('created_at > :date', { date: dateString }).getRawOne();
        const monthlyTotal = result.sum;
        const monthlyRemaining = this.monthlyIncome - result.sum;
        this.monthlyTotal = monthlyTotal;
        this.monthlyRemaining = monthlyRemaining;
        return Promise.resolve({ monthlyTotal, monthlyRemaining });
    }
}
