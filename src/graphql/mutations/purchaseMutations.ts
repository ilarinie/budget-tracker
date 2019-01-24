import { AuthenticationError } from 'apollo-server-express';
import { Purchase } from '../../entity/Purchase';
import { PurchaseCategory } from '../../entity/PurchaseCategory';
import { Response } from '../types';

export const addPurchase = async (parent, args, context) => {
  const purchase = new Purchase();
  let categories: PurchaseCategory[] = [];
  if (args.categories) {
    categories = await PurchaseCategory.findByIds(args.categories);
  }
  purchase.description = args.description;
  purchase.categories = categories;
  purchase.amount = args.amount;
  purchase.user = context.user;
  const savedPurchase = await purchase.save();
  return await Purchase.findOne({ id: savedPurchase.id }, { relations: [ 'user', 'categories' ]});
};

export const removePurchase = async (parent, args, context): Promise<Response> => {
  const purchase = await Purchase.findOneOrFail(args.id, { relations: ['user'] });
  if (purchase.user.id == context.user.id) {
    await purchase.remove();
    return new Response(true);
  }
  throw new AuthenticationError('Unauthorized');
};

export const updatePurchase = async (parent, args, context) => {
  const purchase = await Purchase.findOneOrFail(args.id);
  if (purchase.user == context.user) {
    if (args.amount) {
      purchase.amount = args.amount;
    }
    if (args.description) {
      purchase.description = args.description;
    }
    return await purchase.save();
  }
  throw new AuthenticationError('Unauthorized');
};