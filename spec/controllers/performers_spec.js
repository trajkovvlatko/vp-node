const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const create = require('../factories');
require('../spec_helper');

chai.use(chaiHttp);
chai.should();

describe('performers', () => {
  let user;

  beforeEach(async () => {
    user = await create('users');
  });

  async function addImage(ownerId, userId) {
    await create('images', {
      user_id: userId,
      owner_id: ownerId,
      owner_type: 'Performer',
    });
  }

  describe('GET /', () => {
    it('returns empty array for no performers present', async () => {
      const res = await chai.request(app).get('/performers');
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });

    it('returns list of active performers', async () => {
      const performerIds = [
        (await create('performers', {user_id: user.id})).id,
        (await create('performers', {user_id: user.id})).id,
      ];
      const inactive = await create('performers', {
        user_id: user.id,
        active: false,
      });
      await create('performers', {user_id: user.id});

      await addImage(performerIds[0], user.id);
      await addImage(performerIds[1], user.id);
      await addImage(inactive.id, user.id);

      const res = await chai.request(app).get('/performers');
      res.should.have.status(200);
      res.body.should.be.an('array');
      res.body.length.should.eq(2);
      res.body.map(p => p.id).should.deep.eq(performerIds);
    });
  });

  describe('GET /:id', () => {
    let id;

    beforeEach(async () => {
      const performerIds = [
        (await create('performers', {user_id: user.id})).id,
        (await create('performers', {user_id: user.id})).id,
      ];
      await addImage(performerIds[0], user.id);
      await addImage(performerIds[1], user.id);
      await create('youtube_links', {
        user_id: user.id,
        owner_id: performerIds[0],
        owner_type: 'Performer',
      });
      await create('youtube_links', {
        user_id: user.id,
        owner_id: performerIds[1],
        owner_type: 'Performer',
      });
      id = performerIds[0];
    });

    it('returns an object with a performer', async () => {
      const res = await chai.request(app).get(`/performers/${id}`);
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.id.should.eq(id);
    });

    it('returns an error if performer is not found', async () => {
      const res = await chai.request(app).get('/performers/-1');
      res.should.have.status(404);
      res.body.should.be.an('object');
      res.body.error.should.eq('Record not found.');
    });
  });
});
