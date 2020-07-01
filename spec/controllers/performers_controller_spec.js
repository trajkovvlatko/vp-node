const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const create = require('../factories');
const fs = require('fs');
const data = fs.readFileSync('./config/default.json');
const {host, link} = JSON.parse(data).upload.test;
require('../spec_helper');

chai.use(chaiHttp);
chai.should();

describe('performers', () => {
  let user;

  beforeEach(async () => {
    user = await create('users');
  });

  async function addImage(ownerId, userId, selected = true) {
    return await create('images', {
      userId,
      ownerId,
      ownerType: 'Performer',
      selected,
    });
  }

  describe('GET /', () => {
    it('returns empty array for no performers present', async () => {
      const res = await chai.request(app).get('/performers');
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });

    it('returns list of active performers', async () => {
      const performer1 = await create('performers', {userId: user.id});
      const performer2 = await create('performers', {userId: user.id});
      const inactive = await create('performers', {
        userId: user.id,
        active: false,
      });
      const img1 = await addImage(performer1.id, user.id);
      await addImage(performer1.id, user.id, false);
      const img2 = await addImage(performer2.id, user.id);
      await addImage(inactive.id, user.id);

      const res = await chai.request(app).get('/performers');
      res.should.have.status(200);
      res.body.should.be.an('array');
      res.body.length.should.eq(2);
      res.body.map((p) => p.id).should.deep.eq([performer2.id, performer1.id]);
      Object.keys(res.body[0])
        .sort()
        .should.deep.eq(['id', 'type', 'name', 'rating', 'imageUrl'].sort());
      res.body[0].should.deep.eq({
        id: performer2.id,
        name: performer2.name,
        type: 'performer',
        rating: performer2.rating,
        imageUrl: `${host}/${link}/${img2.image}`,
      });
      res.body[1].should.deep.eq({
        id: performer1.id,
        name: performer1.name,
        type: 'performer',
        rating: performer1.rating,
        imageUrl: `${host}/${link}/${img1.image}`,
      });
    });
  });

  describe('GET /:id', () => {
    let id, performers, genre1, genre2, venue, yt, img, booking1, booking2;

    beforeEach(async () => {
      performers = [
        await create('performers', {userId: user.id}),
        await create('performers', {userId: user.id}),
      ];
      id = performers[0].id;
      venue = await create('venues', {userId: user.id});
      img = await addImage(id, user.id);
      await addImage(performers[1].id, user.id);
      yt = await create('youtube_links', {
        userId: user.id,
        ownerId: id,
        ownerType: 'Performer',
      });
      await create('youtube_links', {
        userId: user.id,
        ownerId: performers[1].id,
        ownerType: 'Performer',
      });
      genre1 = await create('genres', {});
      genre2 = await create('genres', {});
      await create('genres', {});
      await create('genres_performers', {
        genreId: genre1.id,
        performerId: id,
      });
      await create('genres_performers', {
        genreId: genre2.id,
        performerId: id,
      });
      await create('genres_performers', {
        genreId: genre1.id,
        performerId: performers[1].id,
      });
      booking1 = await create('bookings', {
        fromUserId: user.id,
        toUserId: user.id,
        requesterType: 'Performer',
        requesterId: id,
        requestedType: 'Venue',
        requestedId: venue.id,
        status: 'pending',
        bookingDate: '2012-01-01',
      });
      booking2 = await create('bookings', {
        fromUserId: user.id,
        toUserId: user.id,
        requesterType: 'Performer',
        requesterId: performers[1].id,
        requestedType: 'Venue',
        requestedId: venue.id,
        status: 'pending',
        bookingDate: '2013-03-04',
      });
    });

    it('returns an object with a performer', async () => {
      const res = await chai.request(app).get(`/performers/${id}`);
      const expected = performers[0];
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.deep.eq({
        id: expected.id,
        name: expected.name,
        email: expected.email,
        location: expected.location,
        phone: expected.phone,
        details: expected.details,
        website: expected.website,
        rating: expected.rating,
        active: expected.active,
        Genres: [
          {id: genre1.id, name: genre1.name},
          {id: genre2.id, name: genre2.name},
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

    it('returns an error if performer is not found', async () => {
      const res = await chai.request(app).get('/performers/-1');
      res.should.have.status(404);
      res.body.should.be.an('object');
      res.body.error.should.eq('Record not found.');
    });
  });
});
