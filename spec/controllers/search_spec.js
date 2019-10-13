const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const create = require('../factories');
require('../spec_helper');

chai.use(chaiHttp);
chai.should();

describe('search', () => {
  it('returns an error for missing location parameter', async () => {
    const res = await chai.request(app).get(`/search?type=performer`);
    res.should.have.status(422);
    res.body.error.should.eq('Location not provided.');
  });

  context('when nothing is matched', () => {
    it('returns empty array for no performers found', async () => {
      const res = await chai
        .request(app)
        .get(`/search?location=sweden&type=performer`);
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });

    it('returns empty array for no venues found', async () => {
      const res = await chai
        .request(app)
        .get('/search?location=swedentype=venue');
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });
  });

  context('when some are matched', () => {
    it('returns array when performers are found by location', async () => {
      const id = (await create('performers', {
        userId: (await create('users')).id,
        location: 'sweden',
      })).id;
      const path = `/search?type=performer&location=sweden`;
      const res = await chai.request(app).get(path);
      res.should.have.status(200);
      res.body.length.should.eq(1);
      res.body[0].id.should.eq(id);
    });

    it('returns array when venues are found by location', async () => {
      const id = (await create('venues', {
        userId: (await create('users')).id,
        location: 'sweden',
      })).id;
      const path = `/search?type=venue&location=sweden`;
      const res = await chai.request(app).get(path);
      res.should.have.status(200);
      res.body.length.should.eq(1);
      res.body[0].id.should.eq(id);
    });
  });
});
