const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const create = require('../factories');
require('../spec_helper');

chai.use(chaiHttp);
chai.should();

describe('venues', () => {
  let user;

  beforeEach(async () => {
    user = await create('users');
  });

  async function addImage(ownerId, userId) {
    return await create('images', {
      user_id: userId,
      owner_id: ownerId,
      owner_type: 'Venue',
    });
  }

  describe('GET /', () => {
    it('returns empty array for no venues present', async () => {
      const res = await chai.request(app).get('/venues');
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });

    it('returns list of venues', async () => {
      const venueIds = [
        (await create('venues', {user_id: user.id})).id,
        (await create('venues', {user_id: user.id})).id,
      ];
      const inactive = await create('venues', {
        user_id: user.id,
        active: false,
      });
      await create('venues', {user_id: user.id});

      await addImage(venueIds[0], user.id);
      await addImage(venueIds[1], user.id);
      await addImage(inactive.id, user.id);

      const res = await chai.request(app).get('/venues');
      res.should.have.status(200);
      res.body.should.be.an('array');
      res.body.length.should.eq(2);
      res.body.map(p => p.id).should.deep.eq(venueIds);
    });
  });

  describe('GET /:id', () => {
    let venues, prop1, prop2, performer, yt, img, booking1, booking2;

    beforeEach(async () => {
      venues = [
        await create('venues', {user_id: user.id}),
        await create('venues', {user_id: user.id}),
      ];
      performer = await create('performers', {user_id: user.id});
      img = await addImage(venues[0].id, user.id);
      await addImage(venues[1].id, user.id);
      yt = await create('youtube_links', {
        user_id: user.id,
        owner_id: venues[0].id,
        owner_type: 'Venue',
      });
      await create('youtube_links', {
        user_id: user.id,
        owner_id: venues[1].id,
        owner_type: 'Venue',
      });
      prop1 = await create('properties', {});
      prop2 = await create('properties', {});
      await create('properties', {});
      await create('properties_venues', {
        property_id: prop1.id,
        venue_id: venues[0].id,
      });
      await create('properties_venues', {
        property_id: prop2.id,
        venue_id: venues[0].id,
      });
      await create('properties_venues', {
        property_id: prop1.id,
        venue_id: venues[1].id,
      });
      booking1 = await create('bookings', {
        from_user_id: user.id,
        to_user_id: user.id,
        requester_type: 'performer',
        requester_id: performer.id,
        requested_type: 'venue',
        requested_id: venues[0].id,
        status: 'pending',
        booking_date: '2012-01-01',
      });
      booking2 = await create('bookings', {
        from_user_id: user.id,
        to_user_id: user.id,
        requester_type: 'performer',
        requester_id: performer.id,
        requested_type: 'venue',
        requested_id: venues[1].id,
        status: 'pending',
        booking_date: '2013-03-04',
      });
    });

    it('returns an object with a venue', async () => {
      const res = await chai.request(app).get(`/venues/${venues[0].id}`);
      const expected = venues[0];
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
        properties_list: [
          {id: prop1.id, name: prop1.name},
          {id: prop2.id, name: prop2.name},
        ],
        youtube_links_list: [{id: yt.id, link: yt.link}],
        images_list: [{id: img.id, image: img.image, selected: img.selected}],
        bookings_list: [
          {
            date: '2012-01-01T00:00:00',
            performer_id: performer.id,
            performer_name: performer.name,
          },
        ],
      });
    });

    it('returns an error if venue is not found', async () => {
      const res = await chai.request(app).get('/venues/-1');
      res.should.have.status(404);
      res.body.should.be.an('object');
      res.body.error.should.eq('Record not found.');
    });
  });
});
