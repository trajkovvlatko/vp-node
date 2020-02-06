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
    return await create('images', {
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
    let id, performers, genre1, genre2, venue, yt, img, booking1, booking2;

    beforeEach(async () => {
      performers = [
        await create('performers', {user_id: user.id}),
        await create('performers', {user_id: user.id}),
      ];
      id = performers[0].id;
      venue = await create('venues', {user_id: user.id});
      img = await addImage(id, user.id);
      await addImage(performers[1].id, user.id);
      yt = await create('youtube_links', {
        user_id: user.id,
        owner_id: id,
        owner_type: 'Performer',
      });
      await create('youtube_links', {
        user_id: user.id,
        owner_id: performers[1].id,
        owner_type: 'Performer',
      });
      genre1 = await create('genres', {});
      genre2 = await create('genres', {});
      await create('genres', {});
      await create('genres_performers', {
        genre_id: genre1.id,
        performer_id: id,
      });
      await create('genres_performers', {
        genre_id: genre2.id,
        performer_id: id,
      });
      await create('genres_performers', {
        genre_id: genre1.id,
        performer_id: performers[1].id,
      });
      booking1 = await create('bookings', {
        user_id: user.id,
        performer_id: id,
        venue_id: venue.id,
        status: 'pending',
        booking_date: '2012-01-01',
      });
      booking2 = await create('bookings', {
        user_id: user.id,
        performer_id: performers[1].id,
        venue_id: venue.id,
        status: 'pending',
        booking_date: '2013-03-04',
      });
    });

    it('returns an object with a performer', async () => {
      const res = await chai.request(app).get(`/performers/${id}`);
      const expected = performers[0];
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.deep.eq({
        id: expected.id,
        user_id: expected.user_id,
        name: expected.name,
        location: expected.location,
        phone: expected.phone,
        details: expected.details,
        website: expected.website,
        rating: expected.rating,
        active: expected.active,
        created_at: expected.created_at.toISOString(),
        updated_at: expected.updated_at.toISOString(),
        genres_list: [
          {id: genre1.id, name: genre1.name},
          {id: genre2.id, name: genre2.name},
        ],
        youtube_links_list: [{id: yt.id, link: yt.link}],
        images_list: [{id: img.id, image: img.image, selected: img.selected}],
        bookings_list: [
          {
            date: '2012-01-01',
            venue_id: venue.id,
            venue_name: venue.name,
          },
        ],
      });
    });

    it('returns an error if performer is not found', async () => {
      const res = await chai.request(app).get('/performers/-1');
      res.should.have.status(404);
      res.body.should.be.an('object');
      res.body.error.should.eq('Record not found.');
    });
  });
});
