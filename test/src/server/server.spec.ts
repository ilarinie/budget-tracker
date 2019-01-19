import { chai } from '../../index';
import { app } from '../../index';

describe('Server answers at root', () => {
  it('responsds to root route', async () => {
    const response = await chai.request(app).get('/');
    chai.assert.equal(response.status, 200);
  });
});