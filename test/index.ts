import chai from 'chai';
import chaiHttp from 'chai-http';
import { getConnection } from 'typeorm';
import { app, server } from '../src/';
import { Purchase } from '../src/entity/Purchase';
import { PurchaseCategory } from '../src/entity/PurchaseCategory';
import { User } from '../src/entity/User';

chai.use(chaiHttp);

before(done => {
  app.on('appStarted', async () => {
    await clearDb();
    await seedData();
    done();
  });
});

after(() => {
  server.close();
  getConnection().close();
});

export { chai, app };

const clearDb = async () => {
  const data = getConnection().entityMetadatas;
  await data.forEach(async e => {
    const repo = getConnection().getRepository(e.name);
    repo.query(`TRUNCATE TABLE "${e.tableName}" CASCADE;`);
  });
};

const seedData = async () => {
  const userRepo = getConnection().getRepository(User);
  const user = new User();
  user.username = 'muu';
  user.displayName = 'Maa';
  const savedUser = await userRepo.save(user);
  const purchaseCategoryRepo = getConnection().getRepository(PurchaseCategory);
  const category1 = new PurchaseCategory();
  category1.name = 'Cat 1';
  category1.user_id = savedUser.id;
  const savedCat = await purchaseCategoryRepo.save(category1);

  const purchaseRepo = getConnection().getRepository(Purchase);
  for (let i = 0; i < 20; i++) {
    const purchase = new Purchase();
    purchase.amount = parseFloat((Math.random() * 20000).toFixed(2));
    purchase.description = 'dduududu';
    purchase.user = savedUser;
    purchase.categories = [];
    purchase.categories.push(savedCat);
    await purchaseRepo.save(purchase);
  }
};