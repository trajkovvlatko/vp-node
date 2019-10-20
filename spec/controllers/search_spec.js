const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const create = require('../factories');
require('../spec_helper');

chai.use(chaiHttp);
chai.should();

describe('search', () => {
  context('when nothing is matched', () => {
    it('returns empty array for no performers found', async () => {
      const res = await chai.request(app).get(`/search/performers/sweden`);
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });

    it('returns empty array for no venues found', async () => {
      const res = await chai.request(app).get('/search/venues/sweden');
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });
  });

  context('when some are matched', () => {
    context('performers', () => {
      it('returns array when performers are found by location', async () => {
        const userId = (await create('users')).id;
        const id = (await create('performers', {
          user_id: userId,
          location: 'sweden',
        })).id;
        await create('images', {
          user_id: userId,
          owner_id: id,
          owner_type: 'Performer',
        });
        const tmp = await create('performers', {
          user_id: (await create('users')).id,
          location: 'denmark',
        });
        await create('images', {
          user_id: userId,
          owner_id: tmp.id,
          owner_type: 'Performer',
        });
        const path = `/search/performers/sweden`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body[0].id.should.eq(id);
      });

      it('returns array when performers are found by genre', async () => {
        const userId = (await create('users')).id;
        const performerId = (await create('performers', {
          user_id: userId,
          location: 'sweden',
        })).id;
        await create('images', {
          user_id: userId,
          owner_id: performerId,
          owner_type: 'Performer',
        });
        const genreId = (await create('genres', {name: 'genre name'})).id;
        await create('genres_performers', {
          genre_id: genreId,
          performer_id: performerId,
        });

        const path = `/search/performers/sweden?genres=${genreId}`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body[0].id.should.eq(performerId);
      });

      it('returns performers that are free on requested date', async () => {
        const userId = (await create('users')).id;
        const performer1 = await create('performers', {
          user_id: userId,
          location: 'sweden',
        });
        await create('images', {
          user_id: userId,
          owner_id: performer1.id,
          owner_type: 'Performer',
        });
        const performer2 = await create('performers', {
          user_id: userId,
          location: 'sweden',
        });
        await create('images', {
          user_id: userId,
          owner_id: performer2.id,
          owner_type: 'Performer',
        });
        const tmp = await create('performers', {
          user_id: userId,
          location: 'norway',
        });
        await create('images', {
          user_id: userId,
          owner_id: tmp.id,
          owner_type: 'Performer',
        });

        const path = `/search/performers/sweden?date=2011-01-01`;

        let res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(2);

        await create('bookings', {
          user_id: userId,
          venue_id: (await create('venues', {user_id: userId})).id,
          performer_id: performer1.id,
          status: 'booked',
          booking_date: '2011-01-01',
        });
        res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body[0].id.should.eq(performer2.id);
      });

      it('returns performers that match at least one genre', async () => {
        const userId = (await create('users')).id;
        const performer1 = await create('performers', {
          user_id: userId,
          location: 'sweden',
        });
        await create('images', {
          user_id: userId,
          owner_id: performer1.id,
          owner_type: 'Performer',
        });
        const performer2 = await create('performers', {
          user_id: userId,
          location: 'sweden',
        });
        await create('images', {
          user_id: userId,
          owner_id: performer2.id,
          owner_type: 'Performer',
        });
        const performer3 = await create('performers', {
          user_id: userId,
          location: 'norway',
        });
        await create('images', {
          user_id: userId,
          owner_id: performer3.id,
          owner_type: 'Performer',
        });
        const tmp = await create('performers', {
          user_id: userId,
          location: 'sweden',
        });
        await create('images', {
          user_id: userId,
          owner_id: tmp.id,
          owner_type: 'Performer',
        });

        const genre1 = await create('genres', {});
        const genre2 = await create('genres', {});
        await create('genres', {});

        await create('genres_performers', {
          genre_id: genre1.id,
          performer_id: performer1.id,
        });
        await create('genres_performers', {
          genre_id: genre1.id,
          performer_id: performer2.id,
        });
        await create('genres_performers', {
          genre_id: genre2.id,
          performer_id: performer2.id,
        });
        await create('genres_performers', {
          genre_id: genre2.id,
          performer_id: performer3.id,
        });

        const genres = `${genre1.id},${genre2.id}`;
        const path = `/search/performers/sweden?genres=${genres}`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(2);
        res.body
          .map(p => p.id)
          .sort()
          .should.deep.eq([performer1.id, performer2.id].sort());
      });
    });

    context('venues', () => {
      it('returns array when venues are found by location', async () => {
        const userId = (await create('users')).id;
        const id = (await create('venues', {
          user_id: userId,
          location: 'sweden',
        })).id;
        await create('images', {
          user_id: userId,
          owner_id: id,
          owner_type: 'Venue',
        });
        const tmp = await create('venues', {
          user_id: (await create('users')).id,
          location: 'denmark',
        });
        await create('images', {
          user_id: userId,
          owner_id: tmp.id,
          owner_type: 'Venue',
        });
        const path = `/search/venues/sweden`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body[0].id.should.eq(id);
      });

      it('returns array when venues are found by genre', async () => {
        const userId = (await create('users')).id;
        const venueId = (await create('venues', {
          user_id: userId,
          location: 'sweden',
        })).id;
        await create('images', {
          user_id: userId,
          owner_id: venueId,
          owner_type: 'Venue',
        });
        const propertyId = (await create('properties')).id;
        await create('properties_venues', {
          property_id: propertyId,
          venue_id: venueId,
        });

        const path = `/search/venues/sweden?properties=${propertyId}`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body[0].id.should.eq(venueId);
      });

      it('returns venues that are free on requested date', async () => {
        const userId = (await create('users')).id;
        const venue1 = await create('venues', {
          user_id: userId,
          location: 'sweden',
        });
        await create('images', {
          user_id: userId,
          owner_id: venue1.id,
          owner_type: 'Venue',
        });
        const venue2 = await create('venues', {
          user_id: userId,
          location: 'sweden',
        });
        await create('images', {
          user_id: userId,
          owner_id: venue2.id,
          owner_type: 'Venue',
        });
        const tmp = await create('venues', {
          user_id: userId,
          location: 'norway',
        });
        await create('images', {
          user_id: userId,
          owner_id: tmp.id,
          owner_type: 'Venue',
        });

        const path = `/search/venues/sweden?date=2011-01-01`;

        let res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(2);

        await create('bookings', {
          user_id: userId,
          venue_id: venue1.id,
          performer_id: (await create('performers', {user_id: userId})).id,
          status: 'booked',
          booking_date: '2011-01-01',
        });
        res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body[0].id.should.eq(venue2.id);
      });

      it('returns venues that match at least one genre', async () => {
        const userId = (await create('users')).id;
        const venue1 = await create('venues', {
          user_id: userId,
          location: 'sweden',
        });
        await create('images', {
          user_id: userId,
          owner_id: venue1.id,
          owner_type: 'Venue',
        });
        const venue2 = await create('venues', {
          user_id: userId,
          location: 'sweden',
        });
        await create('images', {
          user_id: userId,
          owner_id: venue2.id,
          owner_type: 'Venue',
        });
        const venue3 = await create('venues', {
          user_id: userId,
          location: 'norway',
        });
        await create('images', {
          user_id: userId,
          owner_id: venue3.id,
          owner_type: 'Venue',
        });
        const tmp = await create('venues', {
          user_id: userId,
          location: 'sweden',
        });
        await create('images', {
          user_id: userId,
          owner_id: tmp.id,
          owner_type: 'Venue',
        });

        const property1 = await create('properties', {});
        const property2 = await create('properties', {});
        await create('properties', {});

        await create('properties_venues', {
          property_id: property1.id,
          venue_id: venue1.id,
        });
        await create('properties_venues', {
          property_id: property1.id,
          venue_id: venue2.id,
        });
        await create('properties_venues', {
          property_id: property2.id,
          venue_id: venue2.id,
        });
        await create('properties_venues', {
          property_id: property2.id,
          venue_id: venue3.id,
        });

        const properties = `${property1.id},${property2.id}`;
        const path = `/search/venues/sweden?properties=${properties}`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(2);
        res.body
          .map(p => p.id)
          .sort()
          .should.deep.eq([venue1.id, venue2.id].sort());
      });
    });
  });
});
