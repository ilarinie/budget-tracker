import chai, { assert, expect } from 'chai';
import chaiPromise from 'chai-as-promised';
import jwt from 'jsonwebtoken';
import { ConnectionManager, createConnection, getConnection, getConnectionManager } from 'typeorm';
import { closeConnectionIfNecessary, createConnectionIfNecessary } from '../..';
import { User } from '../../../src/entity/User';
import { context } from '../../../src/graphql';

chai.use(chaiPromise);

describe('Apollo server context spec', () => {
  before(async () => {
    await createConnectionIfNecessary();
  });

  after(async () => {
    await closeConnectionIfNecessary();
  });

  it('can parse use from auth token', async () => {
    const user = new User();
    user.username = 'muupmaap';
    user.password = 'password123';
    await user.save();
    const token = 'Bearer ' + jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET as string);
    const { currentUser } = await context({ req: { headers: { authorization: token }}});
    assert.equal(currentUser.username, user.username);
  });

  it('wont parse invalid auth token', async () => {
    const user = new User();
    user.username = 'muupmaap';
    user.password = 'password123';
    await user.save();
    const token = 'Bearer ' + jwt.sign(JSON.parse(JSON.stringify(user)), 'asdasd' as string);
    const headers = {
      authorization: token
    };

    assert.isRejected(context({ req: { headers }}));
  });
});