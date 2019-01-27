import { User } from '../../entity/User';

export const user = async (parent, args, { currentUser }) => {
  const id = currentUser.id;
  const user = await User.findOne({ id }, { relations: [ 'purchases', 'categories', 'purchases.categories' ]}) as User;
  user.purchases = user.purchases.sort((a, b) => {
    if (a.created_at == b.created_at) {
      return 0;
    }
    return new Date(a.created_at).getMilliseconds() > new Date(b.created_at).getMilliseconds() ? 1 : -1;
  });
  const total = user.purchases.reduce((val, purchase, index) => {
    return val + purchase.amount;
  },                                  0);
  user.total = total;
  return user;
};