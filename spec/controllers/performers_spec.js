const db = require('../../config/database');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
require('../spec_helper');

// Configure chai
chai.use(chaiHttp);
chai.should();

async function addUser() {
  return await db.one(
    'INSERT INTO public.users (name, email, password, active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    ['name', 'email', 'pass', true, '2010-01-01', '2010-01-01'],
  );
}

async function addPerformer(userId) {
  return await db.one(
    'INSERT INTO public.performers(name, user_id, location, phone, active, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    [
      'name',
      userId,
      'location',
      '123 123 123',
      true,
      '2010-01-01',
      '2010-01-01',
    ],
  );
}

describe('performers', () => {
  beforeEach(async () => {
    const user = await addUser();
    const performer = await addPerformer(user.id);
  });

  describe('GET /', () => {
    it('should return 200', done => {
      chai
        .request(app)
        .get('/performers')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.eq(1);
          done();
        });
    });
  });
});
