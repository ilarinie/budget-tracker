import { ApolloServer } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { assert } from 'chai';
import { createConnection, getConnection } from 'typeorm';
import { closeConnectionIfNecessary, createConnectionIfNecessary } from '../..';
import { clearDb } from '../../../src/db/seed';
import { User } from '../../../src/entity/User';
import { resolvers } from '../../../src/graphql';
import { typeDefs } from '../../../src/graphql/types';
import { ADD_CATEGORY, ADD_PURCHASE, GET_USER, REMOVE_CATEGORY, REMOVE_PURCHASE } from './testQueries';

let client;
let user;

describe('GraphQL server', () => {
  before(async () => {
    await createConnectionIfNecessary();
    user = new User();
    user.username = 'muup';
    user.password = 'password123';
    user = await user.save();
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req }) => {
        return { user };
      }
    });
    client = createTestClient(server);
  });
  after(async () => {
    await closeConnectionIfNecessary();
  });

  it('returns a user with a user query', async () => {
    const res = await client.query({ query: GET_USER });
    const returnedUser = res.data.user;
    assert.equal(returnedUser.username, user.username);
    assert.equal(returnedUser.id, user.id);
  });

  it('is able to create a purchase', async () => {
    const res = await client.query({ query: ADD_PURCHASE, variables: { amount: 21, description: 'desc'} });
    const returnedPurchase = res.data.addPurchase;
    assert.equal(returnedPurchase.amount, 21);
    assert.equal(returnedPurchase.description, 'desc');
    assert.equal(returnedPurchase.user.id, user.id);
  });

  it('is able to create a category', async () => {
    const res = await client.query({ query: ADD_CATEGORY, variables: { name: 'cat1' } });
    const returnedPurchase = res.data.addCategory;
    assert.equal(returnedPurchase.name, 'cat1');
  });

  it('is able to use created category to create a purchase', async () => {
    let res = await client.query({ query: GET_USER });
    let retUser = res.data.user;
    assert.equal(retUser.purchases.length, 1);
    assert.equal(retUser.categories.length, 1);
    const purchase = await client.query({ query: ADD_PURCHASE, variables: { description: 'purch', amount: 22, categories: [retUser.categories[0].id] } });
    res = await client.query({ query: GET_USER });
    retUser = res.data.user;
    assert.equal(retUser.purchases[1].amount, 22);
    assert.equal(retUser.purchases[1].description, 'purch');
    assert.equal(retUser.purchases[1].categories[0].name, 'cat1');
  });

  it('is able remove purchase', async () => {
    let res = await client.query({ query: GET_USER });
    const retUser = res.data.user;
    const purchase = retUser.purchases[0];
    res = await client.query({ query: REMOVE_PURCHASE, variables: { id: purchase.id }});
    assert.isTrue(res.data.removePurchase.success);
  });

  it('is able remove category', async () => {
    let res = await client.query({ query: GET_USER });
    const retUser = res.data.user;
    const category = retUser.categories[0];
    res = await client.query({ query: REMOVE_CATEGORY, variables: { id: category.id }});
    assert.isTrue(res.data.removeCategory.success);
  });
});