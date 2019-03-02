import bcrypt from 'bcrypt';
import { Length, Max, Min } from 'class-validator';
import { GraphQLError } from 'graphql';
import { BaseEntity, BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import logger from '../logger';
import { Purchase } from './Purchase';
import { PurchaseCategory } from './PurchaseCategory';

@Entity()
export class UserAccount extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Length(3, 20)
    @Column({ nullable: false })
    username: string;

    @Column()
    password: string;

    @OneToMany(type => Purchase, purchase => purchase.user)
    purchases: Purchase[];

    @OneToMany(type => PurchaseCategory, category => category.user)
    categories: PurchaseCategory[];

    @Column({ nullable: true})
    monthlyExpendableIncome: number;

    @Min(1)
    @Max(28)
    @Column({ nullable: true})
    cutOffDay: number;

    @BeforeInsert()
    hashPassword = async () => {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    total!: number;

    /**
     * Returns all users purchases made after last cut-off (pay) date;
     *
     * @returns Array of ${Purchase}
     */
    getPurchasesAfterLastPayDay = async (countTotal: boolean): Promise<PurchaseArrayReturnType> => {
        const date = new Date();
        if (!(date.getDate() > this.cutOffDay)) {
           date.setMonth(date.getMonth() - 1);
        }
        date.setDate(this.cutOffDay);
        logger.log('info', `Cut off date: ${date.toISOString()}`);
        let monthlyPurchases ;
        try {
            monthlyPurchases  = await Purchase.createQueryBuilder('purchase').where('purchase.user_id = :id', { id: this.id }).andWhere('purchase.created_at > :date', { date }).orderBy('purchase.created_at', 'DESC').getMany();
        } catch (e) {
            logger.log('error', e);
            throw new GraphQLError('Failed to get monthlyPurchases ');
        }

        let monthlyTotal;
        if (countTotal) {
            try {
                monthlyTotal = await Purchase.createQueryBuilder('purchase').select('sum(amount)', 'monthlyTotal').where('purchase.user_id = :id', { id: this.id }).andWhere('purchase.created_at > :date', { date }).getRawOne();
                monthlyTotal = monthlyTotal.monthlyTotal;
            } catch (e) {
                logger.log('error', e);
                throw new GraphQLError('Failed to count monthlyTotal monthlyPurchases ');
            }
        }
        logger.log('info', `Purchase count: ${monthlyPurchases .length}, monthlyTotal: ${monthlyTotal}`);
        return { monthlyPurchases , monthlyTotal };
    }
}

interface PurchaseArrayReturnType {
    monthlyPurchases: Purchase[];
    monthlyTotal?: number;
}
