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
          user_id: (await create('users')).id,
        });
        const res = await chai.request(app).get(`/admin/performers`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('GET /admin/performers/:id', () => {
      it('returns 401', async () => {
        const id = (await create('performers', {
          user_id: (await create('users')).id,
        })).id;
        const res = await chai.request(app).get(`/admin/performers/${id}`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('PATCH /admin/performers/:id', () => {
      it('returns 401', async () => {
        const id = (await create('performers', {
          user_id: (await create('users')).id,
        })).id;
        const options = {name: 'new name'};
        const res = await chai
          .request(app)
          .patch(`/admin/performers/${id}`)
          .set('content-type', 'application/json')
          .send(options);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('POST /admin/performers', () => {
      it('returns 401', async () => {
        const options = {
          name: 'new name',
          location: 'new location',
          phone: 'new phone',
          details: 'new details',
          website: 'new website',
          active: false,
        };
        const res = await chai
          .request(app)
          .post(`/admin/performers`)
          .set('content-type', 'application/json')
          .send(options);
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
        await create('performers', {user_id: (await create('users')).id});
        const res = await chai
          .request(app)
          .get('/admin/performers')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq([]);
      });

      it('returns an array of performers owned by a user', async () => {
        // performer owned by another user
        await create('performers', {user_id: (await create('users')).id});

        // own performers
        const ids = [
          (await create('performers', {user_id: user.id})).id,
          (await create('performers', {user_id: user.id})).id,
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
        const id = (await create('performers', {user_id: tmpUser.id})).id;
        const res = await chai
          .request(app)
          .get(`/admin/performers/${id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.error.should.eq('Performer not found.');
      });

      it('returns a performer when owned by a user', async () => {
        const id = (await create('performers', {user_id: user.id})).id;
        const res = await chai
          .request(app)
          .get(`/admin/performers/${id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.id.should.eq(id);
      });
    });

    describe('PATCH /admin/performers/:id', () => {
      it('updates performer data', async () => {
        const performer = await create('performers', {user_id: user.id});
        const options = {
          name: 'new name',
          location: 'new location',
          phone: 'new phone',
          details: 'new details',
          website: 'new website',
          active: false,
        };
        const res = await chai
          .request(app)
          .patch(`/admin/performers/${performer.id}`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(200);
        res.body.should.include(options);
        res.body.updated_at.should.not.eq(performer.updated_at);
      });

      it("doesn't update performer not owned by the user", async () => {
        const performer = await create('performers', {
          user_id: (await create('users')).id,
        });
        const options = {name: 'new name'};
        const res = await chai
          .request(app)
          .patch(`/admin/performers/${performer.id}`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(404);
        res.body.error.should.eq('Error updating performer.');
      });
    });

    describe('POST /admin/performers', () => {
      it('creates a new performer', async () => {
        const options = {
          name: 'new name',
          location: 'new location',
          phone: 'new phone',
          details: 'new details',
          website: 'new website',
          active: false,
        };
        const res = await chai
          .request(app)
          .post(`/admin/performers`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(200);
        res.body.should.include(options);
        res.body.user_id.should.eq(user.id);
      });

      it("doesn't create a performer for missing data", async () => {
        const options = {active: false};
        const res = await chai
          .request(app)
          .post(`/admin/performers`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(500);
        res.body.error.should.eq('Error creating a performer.');
      });
    });
  });
});
