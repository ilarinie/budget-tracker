import { User } from '../../entity/User';
import { Purchase } from '../../entity/Purchase';
import { getConnection } from 'typeorm';

export const user = async (parent, args, { currentUser }) => {
  const id = currentUser.id;
  const user = await User.findOne({ id }, { relations: [ 'purchases', 'categories', 'purchases.categories' ]}) as User;
  user.purchases = user.purchases.sort((a, b) => {
    if (a.created_at == b.created_at) {
      return 0;
    }
    return new Date(a.created_at).getMilliseconds() > new Date(b.created_at).getMilliseconds() ? 1 : -1;
  });
  await Promise.all([
    user.populateTotal(),
    user.populateMonthlyPurchases(),
    user.populateMonthlyTotals(),
  ]);
  return user;
};