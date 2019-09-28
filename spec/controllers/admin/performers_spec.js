const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const create = require('../factories');
require('../spec_helper');

chai.use(chaiHttp);
chai.should();

describe('performers', () => {
  let user;

  beforeEach(async () => {
    user = await create('users');
  });

  describe('GET /', () => {
    it('returns empty array for no performers present', async () => {
      const res = await chai.request(app).get('/performers');
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });
  });
});
