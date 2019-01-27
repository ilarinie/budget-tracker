import { AuthenticationError } from 'apollo-server-express';
import { validate } from 'class-validator';
import { Purchase } from '../../entity/Purchase';
import { PurchaseCategory } from '../../entity/PurchaseCategory';
import { User } from '../../entity/User';
import { Response } from '../types';
import { mapValidationErrorsToErrorModel } from '../utils';

export const addPurchase = async (parent, { amount, description, categories }: { amount: number, description: string, categories: string[] | PurchaseCategory[]}, { currentUser }: { currentUser: User}) => {
  const purchase = new Purchase();
  if (categories) {
    categories = await PurchaseCategory.findByIds(categories);
  }
  purchase.description = description;
  purchase.categories = categories;
  purchase.amount = amount;
  purchase.user = currentUser;
  const errors = await validate(purchase);
  const response = {};
  if (errors.length > 0) {
    const ErrorModel = mapValidationErrorsToErrorModel(errors, purchase);
    console.log(ErrorModel);
    return null;
  } else {
    const savedPurchase = await purchase.save();
    return await Purchase.findOne({ id: savedPurchase.id }, { relations: [ 'user', 'categories' ]});
  }
};

export const removePurchase = async (parent, args, { currentUser }: { currentUser: User }): Promise<Response> => {
  const purchase = await Purchase.findOneOrFail(args.id, { relations: ['user'] });
  if (purchase.user.id == currentUser.id) {
    await purchase.remove();
    return new Response(true);
  }
  throw new AuthenticationError('Unauthorized');
};

export const updatePurchase = async (parent, { amount, description, id }: { amount: number, description: string, id: string}, { currentUser }: { currentUser: User }) => {
  const purchase = await Purchase.findOneOrFail(id);
  if (purchase.user == currentUser) {
    if (amount !== undefined) {
      purchase.amount = amount;
    }
    if (description !== undefined) {
      purchase.description = description;
    }
    const errors = await validate(purchase);
    if (errors.length > 0) {
      console.log(mapValidationErrorsToErrorModel(errors, purchase));
      return null;
    } else {
      return await purchase.save();
    }
  }
  throw new AuthenticationError('Unauthorized');
};