const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const create = require('../factories');
require('../spec_helper');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('venues', () => {
  beforeEach(async () => {
    const user = await create('users');
    const venue = await create('venues', {userId: user.id});
  });

  describe('GET /', () => {
    it('should return 200', done => {
      chai
        .request(app)
        .get('/venues')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.eq(1);
          done();
        });
    });
  });
});
