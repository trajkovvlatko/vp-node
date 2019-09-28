const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../app.js');
const create = require('../../factories');
const {authUser} = require('../../spec_helper');

chai.use(chaiHttp);
chai.should();

describe('admin/venues', () => {
  context('when user is not signed in', () => {
    describe('GET /admin/venues', () => {
      it('returns 401', async () => {
        await create('venues', {
          userId: (await create('users')).id,
        });
        const res = await chai.request(app).get(`/admin/venues`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('GET /admin/venues/:id', () => {
      it('returns 401', async () => {
        const id = (await create('venues', {
          userId: (await create('users')).id,
        })).id;
        const res = await chai.request(app).get(`/admin/venues/${id}`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });
  });

  context('when user is signed in', () => {
    let token, user;

    beforeEach(async () => {
      user = await create('users');
      token = await authUser(user);
    });

    describe('GET /admin/venues', () => {
      it('returns empty array for no venues found for user', async () => {
        // venues owned by another user
        await create('venues', {userId: (await create('users')).id});
        const res = await chai
          .request(app)
          .get('/admin/venues')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq([]);
      });

      it('returns an array of venues owned by a user', async () => {
        // venue owned by another user
        await create('venues', {userId: (await create('users')).id});

        // own venues
        const ids = [
          (await create('venues', {userId: user.id})).id,
          (await create('venues', {userId: user.id})).id,
        ];

        const res = await chai
          .request(app)
          .get('/admin/venues')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.map(p => p.id).should.deep.eq(ids);
      });
    });

    describe('GET /admin/venues/:id', () => {
      it('returns 404 for venue not found', async () => {
        const res = await chai
          .request(app)
          .get(`/admin/venues/-1`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.error.should.eq('Venue not found.');
      });

      it('returns 404 for venue not owned by the user', async () => {
        const tmpUser = await create('users');
        const id = (await create('venues', {userId: tmpUser.id})).id;
        const res = await chai
          .request(app)
          .get(`/admin/venues/${id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.error.should.eq('Venue not found.');
      });

      it('returns a venue when owned by a user', async () => {
        const id = (await create('venues', {userId: user.id})).id;
        const res = await chai
          .request(app)
          .get(`/admin/venues/${id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.id.should.eq(id);
      });
    });
  });
});
