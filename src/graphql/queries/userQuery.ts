import { User } from '../../entity/User';

export const user = async (parent, args, context) => {
  const id = context.user.id;
  const user = await User.findOne({ id }, { relations: [ 'purchases', 'categories', 'purchases.categories' ]}) as User;
  user.purchases = user.purchases.sort((a, b) => {
    if (a.created_at == b.created_at) {
      return 0;
    }
    return new Date(a.created_at).getMilliseconds() > new Date(b.created_at).getMilliseconds() ? 1 : -1;
  });
  return user;
};