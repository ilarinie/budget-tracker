import { User } from '../../entity/User';

export const user = async (parent, args, context) => {
  const id = context.user.id;
  const user = await User.findOne({ id }, { relations: [ 'purchases', 'categories' ]});
  return user;
};