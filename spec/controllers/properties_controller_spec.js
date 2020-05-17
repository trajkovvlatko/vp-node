const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const create = require('../factories');
require('../spec_helper');

chai.use(chaiHttp);
chai.should();

describe('properties', () => {
  describe('GET /', () => {
    beforeEach(async () => {
      await create('properties', {active: false});
    });

    it('returns empty array for no active properties found', async () => {
      const res = await chai.request(app).get('/properties');
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });

    it('returns list of active properties', async () => {
      const propertyIds = [
        (await create('properties', {active: true})).id,
        (await create('properties', {active: true})).id,
      ];
      const res = await chai.request(app).get('/properties');
      res.should.have.status(200);
      res.body.should.be.an('array');
      res.body.length.should.eq(2);
      res.body.map((p) => p.id).should.deep.eq(propertyIds);
    });
  });
});
