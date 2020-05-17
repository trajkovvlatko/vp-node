const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const create = require('../factories');
require('../spec_helper');

chai.use(chaiHttp);
chai.should();

describe('genres', () => {
  describe('GET /', () => {
    beforeEach(async () => {
      await create('genres', {active: false});
    });

    it('returns empty array for no genres found', async () => {
      const res = await chai.request(app).get('/genres');
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });

    it('returns list of active genres', async () => {
      const genreIds = [
        (await create('genres', {name: 'genre1', active: true})).id,
        (await create('genres', {name: 'genre2', active: true})).id,
      ];
      const res = await chai.request(app).get('/genres');
      res.should.have.status(200);
      res.body.should.be.an('array');
      res.body.length.should.eq(2);
      res.body.map((p) => p.id).should.deep.eq(genreIds);
    });
  });
});
