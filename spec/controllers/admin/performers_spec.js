const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../app.js');
const create = require('../../factories');
const {authUser} = require('../../spec_helper');

chai.use(chaiHttp);
chai.should();

describe('admin/performers', () => {
  context('when user is not signed in', () => {
    describe('GET /admin/performers', () => {
      it('returns 401', async () => {
        await create('performers', {
          userId: (await create('users')).id,
        });
        const res = await chai.request(app).get(`/admin/performers`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('GET /admin/performers/:id', () => {
      it('returns 401', async () => {
        const id = (await create('performers', {
          userId: (await create('users')).id,
        })).id;
        const res = await chai.request(app).get(`/admin/performers/${id}`);
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

    describe('GET /admin/performers', () => {
      it('returns empty array for no performers found for user', async () => {
        // performer owned by another user
        await create('performers', {userId: (await create('users')).id});
        const res = await chai
          .request(app)
          .get('/admin/performers')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq([]);
      });

      it('returns an array of performers owned by a user', async () => {
        // performer owned by another user
        await create('performers', {userId: (await create('users')).id});

        // own performers
        const ids = [
          (await create('performers', {userId: user.id})).id,
          (await create('performers', {userId: user.id})).id,
        ];

        const res = await chai
          .request(app)
          .get('/admin/performers')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.map(p => p.id).should.deep.eq(ids);
      });
    });

    describe('GET /admin/performers/:id', () => {
      it('returns 404 for performer not found', async () => {
        const res = await chai
          .request(app)
          .get(`/admin/performers/-1`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.error.should.eq('Performer not found.');
      });

      it('returns 404 for performer not owned by the user', async () => {
        const tmpUser = await create('users');
        const id = (await create('performers', {userId: tmpUser.id})).id;
        const res = await chai
          .request(app)
          .get(`/admin/performers/${id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.error.should.eq('Performer not found.');
      });

      it('returns a performer when owned by a user', async () => {
        const id = (await create('performers', {userId: user.id})).id;
        const res = await chai
          .request(app)
          .get(`/admin/performers/${id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.id.should.eq(id);
      });
    });
  });
});
