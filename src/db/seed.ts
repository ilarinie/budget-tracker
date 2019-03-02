import Faker from 'faker';
import { createConnection, getConnection } from 'typeorm';
import { Purchase } from '../entity/Purchase';
import { PurchaseCategory } from '../entity/PurchaseCategory';
import { UserAccount } from '../entity/UserAccount';
import logger from '../logger';

export const clearDb = async () => {
  const data = getConnection().entityMetadatas;
  await data.forEach(async e => {
    const repo = getConnection().getRepository(e.name);
    repo.query(`TRUNCATE TABLE "${e.tableName}" CASCADE;`);
  });
};

export const seedData = async () => {
  const userRepo = getConnection().getRepository(UserAccount);
  const user = new UserAccount();
  user.username = 'muu';
  user.password = 'password123';
  user.cutOffDay = 25;
  user.monthlyExpendableIncome = 2800;
  const savedUser = await userRepo.save(user);
  logger.log('info', 'Created user with id: ' + savedUser.id);
  const purchaseCategoryRepo = getConnection().getRepository(PurchaseCategory);
  const category1 = new PurchaseCategory();
  category1.name = Faker.commerce.product();
  category1.user = savedUser;
  category1.purchases = [];
  const savedCat = await purchaseCategoryRepo.save(category1);
  const category2 = new PurchaseCategory();
  category2.name = Faker.commerce.product();
  category2.user = savedUser;
  category2.purchases = [];
  const savedCat2 = await purchaseCategoryRepo.save(category2);
  logger.log('info', 'Created cat with id: ' + savedCat.id);

  const purchaseRepo = getConnection().getRepository(Purchase);
  for (let i = 0; i < 20; i++) {
    const purchase = new Purchase();
    purchase.amount = parseFloat((Math.random() * 20000).toFixed(2));
    purchase.description = Faker.commerce.productName();
    purchase.user = savedUser;
    purchase.categories = [];
    purchase.categories.push(savedCat);
    const savedPurch = await purchaseRepo.save(purchase);
  }
  for (let i = 0; i < 10; i++) {
    const purchase = new Purchase();
    purchase.amount = parseFloat((Math.random() * 20000).toFixed(2));
    purchase.description = Faker.random.word();
    purchase.user = savedUser;
    purchase.categories = [];
    purchase.categories.push(savedCat);
    const savedPurch = await purchaseRepo.save(purchase);
    const sPurch = await purchaseRepo.findOne({ id: savedPurch.id }) as Purchase;
    const date: Date = new Date();
    date.setFullYear(2018);
    sPurch.created_at = date;
    const dPurch = await sPurch.save();

  }

};

const doSeed = async () => {
  await createConnection();
  await clearDb();
  await seedData();
  await getConnection().close();
};

doSeed();