const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');

chai.use(chaiHttp);
chai.should();

describe('auth', () => {
  describe('POST /auth/register', () => {
    it('returns user for successful registration', async () => {
      const options = {
        name: 'Some name',
        email: 'some@email.com',
        password: 'some-password',
      };
      const res = await chai.request(app).post('/auth/register').send(options);

      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.deep.equal({
        name: options.name,
        email: options.email,
      });
    });

    it('returns err for unsuccessful registration', async () => {
      const options = {
        email: 'some@email.com',
        password: 'some-password',
      };
      const res = await chai.request(app).post('/auth/register').send(options);
      res.should.have.status(422);
      res.body.should.deep.eq({error: 'Unprocessable entry.'});
    });
  });
});
