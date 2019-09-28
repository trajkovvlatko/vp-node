const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const create = require('../factories');
require('../spec_helper');

chai.use(chaiHttp);
chai.should();

describe('performers', () => {
  let performerIds, user;

  beforeEach(async () => {
    user = await create('users');
  });

  describe('GET /', () => {
    it('should return empty array for no performers present', async () => {
      const res = await chai.request(app).get('/performers')
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });

    it('should return list of performers', async () => {
      performerIds = [
        (await create('performers', {userId: user.id})).id,
        (await create('performers', {userId: user.id})).id,
      ];
      const res = await chai.request(app).get('/performers')
      res.should.have.status(200);
      res.body.should.be.an('array');
      res.body.length.should.eq(2);
      res.body.map((p) => p.id).should.deep.eq(performerIds);
    });
  });
});
