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

    it('returns list of performers', async () => {
      const performerIds = [
        (await create('performers', {user_id: user.id})).id,
        (await create('performers', {user_id: user.id})).id,
      ];
      const res = await chai.request(app).get('/performers');
      res.should.have.status(200);
      res.body.should.be.an('array');
      res.body.length.should.eq(2);
      res.body.map(p => p.id).should.deep.eq(performerIds);
    });
  });

  describe('GET /:id', () => {
    let id;

    beforeEach(async () => {
      const performerIds = [
        (await create('performers', {user_id: user.id})).id,
        (await create('performers', {user_id: user.id})).id,
      ];
      id = performerIds[0];
    });

    it('returns an object with a performer', async () => {
      const res = await chai.request(app).get(`/performers/${id}`);
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.id.should.eq(id);
    });

    it('returns an error if performer is not found', async () => {
      const res = await chai.request(app).get('/performers/-1');
      res.should.have.status(404);
      res.body.should.be.an('object');
      res.body.error.should.eq('Record not found.');
    });
  });
});
