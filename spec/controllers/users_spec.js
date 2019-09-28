const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const create = require('../factories');
require('../spec_helper');

chai.use(chaiHttp);
chai.should();

async function authUser(user) {
  const auth = await chai
    .request(app)
    .post(`/auth/login?email=${user.email}&password=${user.password}`);
  return auth.body.token;
}

describe('users', () => {
  beforeEach(async () => {});

  describe('GET /profile', () => {
    it('returns 401 error for user not signed in', async () => {
      const user = await create('users');
      const res = await chai.request(app).get('/profile');
      res.should.have.status(401);
      res.body.should.be.an('object');
      res.body.should.deep.eq({});
    });

    it('returns user profile for signed in user', async () => {
      const user = await create('users');
      const token = await authUser(user);

      const res = await chai
        .request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${token}`)

      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.deep.eq({
        id: user.id,
        name: user.name,
        email: user.email,
      })
    });
  });
});
