import { InvalidGraphQLRequestError } from 'apollo-server-core/dist/requestPipeline';
import { Purchase } from '../../entity/Purchase';
import { UserAccount } from '../../entity/UserAccount';
import logger from '../../logger';

export const user = async (parent, args, { currentUser }) => {
  const id = currentUser.id;
  // @ts-ignore
  const user = await UserAccount.findOne({ id }, { relations: [ 'categories' ]}) as UserAccount;
  if (!user) {
    throw new InvalidGraphQLRequestError();
  }
  user.purchases = await Purchase.find({ where: { user_id: user.id }, relations: [ 'categories'], order: { created_at: 'DESC'}}) as Purchase[];
  const { total } = await Purchase.createQueryBuilder('purchase').select('sum(amount)', 'total').where('user_id = :id', { id: user.id}).getRawOne();

  const { monthlyPurchases, monthlyTotal } = await user.getPurchasesAfterLastPayDay(true);
  const monthlyRemaining = user.monthlyExpendableIncome - monthlyTotal! as number;
  return { monthlyPurchases, monthlyTotal, total, monthlyRemaining, ...user };
};
