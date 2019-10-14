const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const create = require('../factories');
require('../spec_helper');

chai.use(chaiHttp);
chai.should();

describe('venues', () => {
  let user;

  beforeEach(async () => {
    user = await create('users');
  });

  describe('GET /', () => {
    it('returns empty array for no venues present', async () => {
      const res = await chai.request(app).get('/venues');
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });

    it('returns list of venues', async () => {
      const venueIds = [
        (await create('venues', {user_id: user.id})).id,
        (await create('venues', {user_id: user.id})).id,
      ];
      const res = await chai.request(app).get('/venues');
      res.should.have.status(200);
      res.body.should.be.an('array');
      res.body.length.should.eq(2);
      res.body.map(p => p.id).should.deep.eq(venueIds);
    });
  });

  describe('GET /:id', () => {
    let id;

    beforeEach(async () => {
      const venueIds = [
        (await create('venues', {user_id: user.id})).id,
        (await create('venues', {user_id: user.id})).id,
      ];
      id = venueIds[0];
    });

    it('returns an object with a venue', async () => {
      const res = await chai.request(app).get(`/venues/${id}`);
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.id.should.eq(id);
    });

    it('returns an error if venue is not found', async () => {
      const res = await chai.request(app).get('/venues/-1');
      res.should.have.status(404);
      res.body.should.be.an('object');
      res.body.error.should.eq('Record not found.');
    });
  });
});
