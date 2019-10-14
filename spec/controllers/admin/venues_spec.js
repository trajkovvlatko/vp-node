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
          user_id: (await create('users')).id,
        });
        const res = await chai.request(app).get(`/admin/venues`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('GET /admin/venues/:id', () => {
      it('returns 401', async () => {
        const id = (await create('venues', {
          user_id: (await create('users')).id,
        })).id;
        const res = await chai.request(app).get(`/admin/venues/${id}`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('PATCH /admin/venues/:id', () => {
      it('returns 401', async () => {
        const id = (await create('venues', {
          user_id: (await create('users')).id,
        })).id;
        const options = {name: 'new name'};
        const res = await chai
          .request(app)
          .patch(`/admin/venues/${id}`)
          .set('content-type', 'application/json')
          .send(options);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('POST /admin/venues', () => {
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
          .post(`/admin/venues`)
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

    describe('GET /admin/venues', () => {
      it('returns empty array for no venues found for user', async () => {
        // venues owned by another user
        await create('venues', {user_id: (await create('users')).id});
        const res = await chai
          .request(app)
          .get('/admin/venues')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq([]);
      });

      it('returns an array of venues owned by a user', async () => {
        // venue owned by another user
        await create('venues', {user_id: (await create('users')).id});

        // own venues
        const ids = [
          (await create('venues', {user_id: user.id})).id,
          (await create('venues', {user_id: user.id})).id,
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
        const id = (await create('venues', {user_id: tmpUser.id})).id;
        const res = await chai
          .request(app)
          .get(`/admin/venues/${id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.error.should.eq('Venue not found.');
      });

      it('returns a venue when owned by a user', async () => {
        const id = (await create('venues', {user_id: user.id})).id;
        const res = await chai
          .request(app)
          .get(`/admin/venues/${id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.id.should.eq(id);
      });
    });

    describe('PATCH /admin/venues/:id', () => {
      it('updates venue data', async () => {
        const venue = await create('venues', {user_id: user.id});
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
          .patch(`/admin/venues/${venue.id}`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(200);
        res.body.should.include(options);
        res.body.updated_at.should.not.eq(venue.updated_at);
      });

      it("doesn't update venues not owned by the user", async () => {
        const venue = await create('venues', {
          user_id: (await create('users')).id,
        });
        const options = {name: 'new name'};
        const res = await chai
          .request(app)
          .patch(`/admin/venues/${venue.id}`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(404);
        res.body.error.should.eq('Error updating venue.');
      });
    });

    describe('POST /admin/venues', () => {
      it('creates a new venue', async () => {
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
          .post(`/admin/venues`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(200);
        res.body.should.include(options);
        res.body.user_id.should.eq(user.id);
      });

      it("doesn't create a venue for missing data", async () => {
        const options = {active: false};
        const res = await chai
          .request(app)
          .post(`/admin/venues`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(500);
        res.body.error.should.eq('Error creating a venue.');
      });
    });
  });
});
