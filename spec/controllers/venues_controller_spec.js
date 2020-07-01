const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const create = require('../factories');
const host = process.env.UPLOAD_HOST;
const link = process.env.UPLOAD_LINK;
require('../spec_helper');

chai.use(chaiHttp);
chai.should();

describe('venues', () => {
  let user;

  beforeEach(async () => {
    user = await create('users');
  });

  async function addImage(ownerId, userId, selected = true) {
    return await create('images', {
      userId,
      ownerId,
      ownerType: 'Venue',
      selected,
    });
  }

  describe('GET /', () => {
    it('returns empty array for no venues present', async () => {
      const res = await chai.request(app).get('/venues');
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });

    it('returns list of active venues', async () => {
      const venue1 = await create('venues', {userId: user.id});
      const venue2 = await create('venues', {userId: user.id});
      const inactive = await create('venues', {
        userId: user.id,
        active: false,
      });
      const img1 = await addImage(venue1.id, user.id);
      await addImage(venue1.id, user.id, false);
      const img2 = await addImage(venue2.id, user.id);
      await addImage(inactive.id, user.id);

      const res = await chai.request(app).get('/venues');
      res.should.have.status(200);
      res.body.should.be.an('array');
      res.body.length.should.eq(2);
      res.body.map((v) => v.id).should.deep.eq([venue2.id, venue1.id]);
      Object.keys(res.body[0])
        .sort()
        .should.deep.eq(['id', 'type', 'name', 'rating', 'imageUrl'].sort());
      res.body[0].should.deep.eq({
        id: venue2.id,
        name: venue2.name,
        type: 'venue',
        rating: venue2.rating,
        imageUrl: `${host}/${link}/${img2.image}`,
      });
      res.body[1].should.deep.eq({
        id: venue1.id,
        name: venue1.name,
        type: 'venue',
        rating: venue1.rating,
        imageUrl: `${host}/${link}/${img1.image}`,
      });
    });
  });

  describe('GET /:id', () => {
    let id,
      venues,
      property1,
      property2,
      performer,
      yt,
      img,
      booking1,
      booking2;

    beforeEach(async () => {
      venues = [
        await create('venues', {userId: user.id}),
        await create('venues', {userId: user.id}),
      ];
      id = venues[0].id;
      performer = await create('performers', {userId: user.id});
      img = await addImage(id, user.id);
      await addImage(venues[1].id, user.id);
      yt = await create('youtube_links', {
        userId: user.id,
        ownerId: id,
        ownerType: 'Venue',
      });
      await create('youtube_links', {
        userId: user.id,
        ownerId: venues[1].id,
        ownerType: 'Venue',
      });
      property1 = await create('properties', {});
      property2 = await create('properties', {});
      await create('properties', {});
      await create('properties_venues', {
        propertyId: property1.id,
        venueId: id,
      });
      await create('properties_venues', {
        propertyId: property2.id,
        venueId: id,
      });
      await create('properties_venues', {
        propertyId: property1.id,
        venueId: venues[1].id,
      });
      booking1 = await create('bookings', {
        fromUserId: user.id,
        toUserId: user.id,
        requesterType: 'Venue',
        requesterId: id,
        requestedType: 'Performer',
        requestedId: performer.id,
        status: 'pending',
        bookingDate: '2012-01-01',
      });
      booking2 = await create('bookings', {
        fromUserId: user.id,
        toUserId: user.id,
        requesterType: 'Venue',
        requesterId: venues[1].id,
        requestedType: 'Performer',
        requestedId: performer.id,
        status: 'pending',
        bookingDate: '2013-03-04',
      });
    });

    it('returns an object with a venue', async () => {
      const res = await chai.request(app).get(`/venues/${id}`);
      const expected = venues[0];
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.deep.eq({
        id: expected.id,
        name: expected.name,
        email: expected.email,
        address: expected.address,
        location: expected.location,
        phone: expected.phone,
        details: expected.details,
        website: expected.website,
        rating: expected.rating,
        active: expected.active,
        Properties: [
          {id: property1.id, name: property1.name},
          {id: property2.id, name: property2.name},
        ],
        YoutubeLinks: [{id: yt.id, link: yt.link}],
        Images: [
          {
            id: img.id,
            image: img.image,
            imageUrl: `${host}/${link}/${img.image}`,
            selected: img.selected,
          },
        ],
        Bookings: [
          {
            id: booking1.id,
            date: booking1.bookingDate,
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
