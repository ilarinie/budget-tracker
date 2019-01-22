import { AuthenticationError } from 'apollo-server-express';
import { PurchaseCategory } from '../../entity/PurchaseCategory';
import logger from '../../logger';

export const addCategory = async (parent, args, context) => {
  const category = new PurchaseCategory();
  category.name = args.name;
  category.user = context.user;
  const savedCat = category.save();
  return savedCat;
};

export const removeCategory = async (parent, args, context) => {
  const category = await PurchaseCategory.findOneOrFail(args.id);
  if (category.user = context.user) {
    await category.remove();
    return category.id;
  }
  throw new AuthenticationError('Unauthorized');
};

export const updateCategory = async (parent, args, context) => {
  const category = await PurchaseCategory.findOneOrFail(args.id);
  if (category.user == context.user) {
    if (args.name) {
      category.name = args.name;
    }
    return await category.save();
  }
  throw new AuthenticationError('Unauthorized');
};