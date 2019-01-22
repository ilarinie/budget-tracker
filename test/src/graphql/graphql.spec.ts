import { ApolloServer } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { assert } from 'chai';
import { createConnection, getConnection } from 'typeorm';
import { User } from '../../../src/entity/User';
import { resolvers } from '../../../src/graphql';
import { typeDefs } from '../../../src/graphql/types';
import { ADD_CATEGORY, ADD_PURCHASE, GET_USER } from './testQueries';

let client;
let user;

describe('GraphQL server', () => {
  before(async () => {
    await createConnection();
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
    await getConnection().close();
  });

  it('returns a user with a user query', async () => {
    const res = await client.query({ query: GET_USER });
    const returnedUser = res.data.user;
    assert.equal(returnedUser.username, user.username);
    assert.equal(returnedUser.id, user.id);
  });

  it('is able to create a purchase', async () => {
    const res = await client.query({ query: ADD_PURCHASE });
    const returnedPurchase = res.data.addPurchase;
    assert.equal(returnedPurchase.amount, 21);
    assert.equal(returnedPurchase.description, 'desc');
    assert.equal(returnedPurchase.user.id, user.id);
  });

  it('is able to create a category', async () => {
    const res = await client.query({ query: ADD_CATEGORY });
    const returnedPurchase = res.data.addCategory;
    assert.equal(returnedPurchase.name, 'cat1');
  });

  it('is able to create category and a purchase with that category', async () => {
    const res = await client.query({ query: GET_USER });
    const retUser = res.data.user;
    assert.equal(retUser.purchases.length, 1);
    assert.equal(retUser.categories.length, 1);
  });
});