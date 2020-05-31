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
        const performer = await create('performers', {
          userId,
          location: 'sweden',
        });
        const performerImage = await create('images', {
          userId,
          ownerId: performer.id,
          ownerType: 'Performer',
        });
        const tmp = await create('performers', {
          userId: (await create('users')).id,
          location: 'denmark',
        });
        await create('images', {
          userId,
          ownerId: tmp.id,
          ownerType: 'Performer',
        });
        const path = `/search/performers/sweden`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body[0].should.deep.eq({
          id: performer.id,
          name: performer.name,
          rating: performer.rating,
          imageUrl: performerImage.get('imageUrl'),
          type: 'performer',
        });
      });

      it('returns array when performers are found by genre', async () => {
        const userId = (await create('users')).id;
        const performer = await create('performers', {
          userId,
          location: 'sweden',
        });
        const performerImage = await create('images', {
          userId,
          ownerId: performer.id,
          ownerType: 'Performer',
        });
        const genre = await create('genres', {name: 'genre name'});
        await create('genres_performers', {
          genreId: genre.id,
          performerId: performer.id,
        });

        const tmpPerformerId = (
          await create('performers', {userId, location: 'sweden'})
        ).id;
        await create('images', {
          userId,
          ownerId: tmpPerformerId,
          ownerType: 'Performer',
        });
        const tmpGenreId = (await create('genres', {name: 'tmp genre'})).id;
        await create('genres_performers', {
          genreId: tmpGenreId,
          performerId: tmpPerformerId,
        });

        const path = `/search/performers/sweden?genres=${genre.id}`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body[0].should.deep.eq({
          id: performer.id,
          name: performer.name,
          rating: performer.rating,
          imageUrl: performerImage.get('imageUrl'),
          type: 'performer',
        });
      });

      it('returns performers that are free on requested date', async () => {
        const userId = (await create('users')).id;
        const performer1 = await create('performers', {
          userId,
          location: 'sweden',
        });
        await create('images', {
          userId,
          ownerId: performer1.id,
          ownerType: 'Performer',
        });
        const performer2 = await create('performers', {
          userId,
          location: 'sweden',
        });
        const image = await create('images', {
          userId,
          ownerId: performer2.id,
          ownerType: 'Performer',
        });
        const tmp = await create('performers', {
          userId: userId,
          location: 'norway',
        });
        await create('images', {
          userId,
          ownerId: tmp.id,
          ownerType: 'Performer',
        });

        const path = `/search/performers/sweden?date=2011-02-02`;

        let res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(2);
        res.body
          .map((p) => p.id)
          .should.deep.equal([performer1.id, performer2.id]);

        await create('bookings', {
          fromUserId: userId,
          toUserId: userId,
          requesterId: (await create('venues', {userId})).id,
          requesterType: 'Venue',
          requestedId: performer1.id,
          requestedType: 'Performer',
          status: 'booked',
          bookingDate: '2011-02-02',
        });

        res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body[0].should.deep.eq({
          id: performer2.id,
          name: performer2.name,
          rating: performer2.rating,
          imageUrl: image.get('imageUrl'),
          type: 'performer',
        });
      });

      it('returns performers that match at least one genre', async () => {
        const userId = (await create('users')).id;
        const performer1 = await create('performers', {
          userId,
          location: 'sweden',
        });
        const image1 = await create('images', {
          userId,
          ownerId: performer1.id,
          ownerType: 'Performer',
        });
        const performer2 = await create('performers', {
          userId,
          location: 'sweden',
        });
        const image2 = await create('images', {
          userId,
          ownerId: performer2.id,
          ownerType: 'Performer',
        });
        const performer3 = await create('performers', {
          userId,
          location: 'norway',
        });
        await create('images', {
          userId,
          ownerId: performer3.id,
          ownerType: 'Performer',
        });
        const tmp = await create('performers', {
          userId,
          location: 'sweden',
        });
        await create('images', {
          userId,
          ownerId: tmp.id,
          ownerType: 'Performer',
        });

        const genre1 = await create('genres', {});
        const genre2 = await create('genres', {});
        await create('genres', {});

        await create('genres_performers', {
          genreId: genre1.id,
          performerId: performer1.id,
        });
        await create('genres_performers', {
          genreId: genre1.id,
          performerId: performer2.id,
        });
        await create('genres_performers', {
          genreId: genre2.id,
          performerId: performer2.id,
        });
        await create('genres_performers', {
          genreId: genre2.id,
          performerId: performer3.id,
        });

        const genres = `${genre1.id},${genre2.id}`;
        const path = `/search/performers/sweden?genres=${genres}`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(2);
        res.body.should.deep.eq([
          {
            id: performer1.id,
            name: performer1.name,
            rating: performer1.rating,
            imageUrl: image1.get('imageUrl'),
            type: 'performer',
          },
          {
            id: performer2.id,
            name: performer2.name,
            rating: performer2.rating,
            imageUrl: image2.get('imageUrl'),
            type: 'performer',
          },
        ]);
      });
    });

    context('venues', () => {
      it('returns array when venues are found by location', async () => {
        const userId = (await create('users')).id;
        const venue = await create('venues', {
          userId,
          location: 'sweden',
        });
        const image = await create('images', {
          userId,
          ownerId: venue.id,
          ownerType: 'Venue',
        });
        const tmp = await create('venues', {
          userId: (await create('users')).id,
          location: 'denmark',
        });
        await create('images', {
          userId,
          ownerId: tmp.id,
          ownerType: 'Venue',
        });
        const path = `/search/venues/sweden`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body[0].should.deep.eq({
          id: venue.id,
          name: venue.name,
          rating: venue.rating,
          imageUrl: image.get('imageUrl'),
          type: 'venue',
        });
      });

      it('returns array when venues are found by property', async () => {
        const userId = (await create('users')).id;
        const venue = await create('venues', {
          userId: userId,
          location: 'sweden',
        });
        const image = await create('images', {
          userId,
          ownerId: venue.id,
          ownerType: 'Venue',
        });
        const propertyId = (await create('properties')).id;
        await create('properties_venues', {propertyId, venueId: venue.id});

        const path = `/search/venues/sweden?properties=${propertyId}`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body[0].should.deep.eq({
          id: venue.id,
          name: venue.name,
          rating: venue.rating,
          imageUrl: image.get('imageUrl'),
          type: 'venue',
        });
      });

      it('returns venues that are free on requested date', async () => {
        const userId = (await create('users')).id;
        const venue1 = await create('venues', {userId, location: 'sweden'});
        const image1 = await create('images', {
          userId,
          ownerId: venue1.id,
          ownerType: 'Venue',
        });
        const venue2 = await create('venues', {
          userId,
          location: 'sweden',
        });
        const image2 = await create('images', {
          userId,
          ownerId: venue2.id,
          ownerType: 'Venue',
        });
        const tmp = await create('venues', {
          userId: userId,
          location: 'norway',
        });
        await create('images', {
          userId: userId,
          ownerId: tmp.id,
          ownerType: 'Venue',
        });

        const path = `/search/venues/sweden?date=2011-01-01`;

        let res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(2);
        res.body.should.deep.eq([
          {
            id: venue1.id,
            name: venue1.name,
            rating: venue1.rating,
            imageUrl: image1.get('imageUrl'),
            type: 'venue',
          },
          {
            id: venue2.id,
            name: venue2.name,
            rating: venue2.rating,
            imageUrl: image2.get('imageUrl'),
            type: 'venue',
          },
        ]);

        await create('bookings', {
          fromUserId: userId,
          toUserId: userId,
          requesterId: venue1.id,
          requesterType: 'Venue',
          requestedId: (await create('performers', {userId})).id,
          requestedType: 'Performer',
          status: 'booked',
          bookingDate: '2011-01-01',
        });
        res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body[0].id.should.eq(venue2.id);
        res.body[0].should.deep.eq({
          id: venue2.id,
          name: venue2.name,
          rating: venue2.rating,
          imageUrl: image2.get('imageUrl'),
          type: 'venue',
        });
      });

      it('returns venues that match at least one property', async () => {
        const userId = (await create('users')).id;
        const venue1 = await create('venues', {userId, location: 'sweden'});
        const image1 = await create('images', {
          userId,
          ownerId: venue1.id,
          ownerType: 'Venue',
        });
        const venue2 = await create('venues', {userId, location: 'sweden'});
        const image2 = await create('images', {
          userId,
          ownerId: venue2.id,
          ownerType: 'Venue',
        });
        const venue3 = await create('venues', {userId, location: 'norway'});
        await create('images', {
          userId,
          ownerId: venue3.id,
          ownerType: 'Venue',
        });
        const tmp = await create('venues', {
          userId,
          location: 'sweden',
        });
        await create('images', {
          userId,
          ownerId: tmp.id,
          ownerType: 'Venue',
        });

        const property1 = await create('properties', {});
        const property2 = await create('properties', {});
        await create('properties', {});

        await create('properties_venues', {
          propertyId: property1.id,
          venueId: venue1.id,
        });
        await create('properties_venues', {
          propertyId: property1.id,
          venueId: venue2.id,
        });
        await create('properties_venues', {
          propertyId: property2.id,
          venueId: venue2.id,
        });
        await create('properties_venues', {
          propertyId: property2.id,
          venueId: venue3.id,
        });

        const properties = `${property1.id},${property2.id}`;
        const path = `/search/venues/sweden?properties=${properties}`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(2);
        res.body.should.deep.eq([
          {
            id: venue1.id,
            name: venue1.name,
            rating: venue1.rating,
            imageUrl: image1.get('imageUrl'),
            type: 'venue',
          },
          {
            id: venue2.id,
            name: venue2.name,
            rating: venue2.rating,
            imageUrl: image2.get('imageUrl'),
            type: 'venue',
          },
        ]);
      });
    });
  });
});
