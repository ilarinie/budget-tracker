import { createConnection, getConnection } from 'typeorm';
import { Purchase } from '../entity/Purchase';
import { PurchaseCategory } from '../entity/PurchaseCategory';
import { User } from '../entity/User';
import logger from '../logger';

export const clearDb = async () => {
  const data = getConnection().entityMetadatas;
  await data.forEach(async e => {
    const repo = getConnection().getRepository(e.name);
    repo.query(`TRUNCATE TABLE "${e.tableName}" CASCADE;`);
  });
};

export const seedData = async () => {
  const userRepo = getConnection().getRepository(User);
  const user = new User();
  user.username = 'muu';
  user.password = 'password123';
  const savedUser = await userRepo.save(user);
  logger.log('info', 'Created user with id: ' + savedUser.id);
  const purchaseCategoryRepo = getConnection().getRepository(PurchaseCategory);
  const category1 = new PurchaseCategory();
  category1.name = 'Cat 1';
  category1.user = savedUser;
  category1.purchases = [];
  const savedCat = await purchaseCategoryRepo.save(category1);
  logger.log('info', 'Created cat with id: ' + savedCat.id);

  const purchaseRepo = getConnection().getRepository(Purchase);
  for (let i = 0; i < 20; i++) {
    const purchase = new Purchase();
    purchase.amount = parseFloat((Math.random() * 20000).toFixed(2));
    purchase.description = 'dduududu';
    purchase.user = savedUser;
    purchase.categories = [];
    purchase.categories.push(savedCat);
    const savedPurch = await purchaseRepo.save(purchase);
  }
};

const doSeed = async () => {
  await createConnection();
  await clearDb();
  await seedData();
  await getConnection().close();
};

doSeed();