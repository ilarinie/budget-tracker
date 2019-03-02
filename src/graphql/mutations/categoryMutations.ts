import { AuthenticationError } from 'apollo-server-express';
import { PurchaseCategory } from '../../entity/PurchaseCategory';
import { UserAccount } from '../../entity/UserAccount';
import logger from '../../logger';
import { Response } from '../types';

export const addCategory = async (parent, args, { currentUser }: { currentUser: UserAccount}) => {
  const category = new PurchaseCategory();
  category.name = args.name;
  category.user = currentUser;
  const savedCat = category.save();
  return savedCat;
};

export const removeCategory = async (parent, args, { currentUser }: { currentUser: UserAccount}) => {
  const category = await PurchaseCategory.findOneOrFail(args.id);
  if (category.user = currentUser) {
    await category.remove();
    return new Response(true);
  }
  throw new AuthenticationError('Unauthorized');
};

export const updateCategory = async (parent, args, { currentUser }: { currentUser: UserAccount}) => {
  const category = await PurchaseCategory.findOneOrFail(args.id);
  if (category.user == currentUser) {
    if (args.name) {
      category.name = args.name;
    }
    return await category.save();
  }
  throw new AuthenticationError('Unauthorized');
};