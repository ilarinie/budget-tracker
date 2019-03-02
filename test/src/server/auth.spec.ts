import chai from 'chai';
import chaiHttp from 'chai-http';
import { createConnection, getConnection } from 'typeorm';
import { closeConnectionIfNecessary, createConnectionIfNecessary } from '../..';
import { UserAccount } from '../../../src/entity/UserAccount';
import app from '../../../src/server';

const TEST_AUTH = {
  username: 'test_user',
  password: 'password123'
};

chai.use(chaiHttp);

describe('Auth routes', () => {
  before(async () => {
    await createConnectionIfNecessary();
    const user = new UserAccount();
    user.username = TEST_AUTH.username;
    user.password = TEST_AUTH.password;
    await user.save();
  });

  after(async () => {
    await closeConnectionIfNecessary();
  });

  it('returns a token with correct login', async () => {
    const response = await chai.request(app).post('/login').send(TEST_AUTH);
    chai.assert.equal(response.status, 200);
    chai.expect(response).to.have.header('Authorization');
  });

  it('doesnt return a token with incorrect login', async () => {
    const response = await chai.request(app).post('/login').send({ username: 'blabaaa', password: 'password12312313'});
    chai.assert.equal(response.status, 401);
  });
});