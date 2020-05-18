const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../app.js');
const create = require('../../factories');
const {authUser} = require('../../spec_helper');
const Image = require('../../../app/models/image_model.js');
const fs = require('fs');
const data = fs.readFileSync('./config/default.json');
const {host, link} = JSON.parse(data).upload.test;

chai.use(chaiHttp);
chai.should();

describe('user/venues', () => {
  context('when user is not signed in', () => {
    describe('GET /user/venues', () => {
      it('returns 401', async () => {
        await create('venues', {
          userId: (await create('users')).id,
        });
        const res = await chai.request(app).get(`/user/venues`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('GET /user/venues/:id', () => {
      it('returns 401', async () => {
        const id = (
          await create('venues', {
            userId: (await create('users')).id,
          })
        ).id;
        const res = await chai.request(app).get(`/user/venues/${id}`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('PATCH /user/venues/:id', () => {
      it('returns 401', async () => {
        const id = (
          await create('venues', {
            userId: (await create('users')).id,
          })
        ).id;
        const options = {name: 'new name'};
        const res = await chai
          .request(app)
          .patch(`/user/venues/${id}`)
          .set('content-type', 'application/json')
          .send(options);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('POST /user/venues', () => {
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
          .post(`/user/venues`)
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

    describe('GET /user/venues', () => {
      it('returns empty array for no venues found for user', async () => {
        // venues owned by another user
        await create('venues', {userId: (await create('users')).id});
        const res = await chai
          .request(app)
          .get('/user/venues')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq([]);
      });

      it('returns an array of venues owned by a user', async () => {
        // venue owned by another user
        await create('venues', {userId: (await create('users')).id});

        // own venues
        const venue1 = await create('venues', {userId: user.id});
        const venue2 = await create('venues', {userId: user.id});

        const res = await chai
          .request(app)
          .get('/user/venues')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq([
          {
            id: venue1.id,
            name: venue1.name,
          },
          {
            id: venue2.id,
            name: venue2.name,
          },
        ]);
      });
    });

    describe('GET /user/venues/active', () => {
      it('returns empty array for no active venues found', async () => {
        // inactive venue
        await create('venues', {userId: user.id, active: false});
        const res = await chai
          .request(app)
          .get('/user/venues/active')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq([]);
      });

      it('returns an array of venues owned by a user', async () => {
        // venue owned by another user
        await create('venues', {userId: (await create('users')).id});
        // own venues
        const venue1 = await create('venues', {userId: user.id});
        const venue2 = await create('venues', {userId: user.id});
        // inactive venue
        await create('venues', {userId: user.id, active: false});

        const res = await chai
          .request(app)
          .get('/user/venues/active')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq([
          {
            id: venue1.id,
            name: venue1.name,
          },
          {
            id: venue2.id,
            name: venue2.name,
          },
        ]);
      });
    });

    describe('GET /user/venues/:id', () => {
      it('returns 404 for venue not found', async () => {
        const res = await chai
          .request(app)
          .get(`/user/venues/-1`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.error.should.eq('Venue not found.');
      });

      it('returns 404 for venue not owned by the user', async () => {
        const tmpUser = await create('users');
        const id = (await create('venues', {userId: tmpUser.id})).id;
        const res = await chai
          .request(app)
          .get(`/user/venues/${id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.error.should.eq('Venue not found.');
      });

      it('returns a venue when owned by a user', async () => {
        const venue = await create('venues', {userId: user.id});
        const res = await chai
          .request(app)
          .get(`/user/venues/${venue.id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq({
          id: venue.id,
          name: venue.name,
          active: venue.active,
          location: venue.location,
          details: venue.details,
          website: venue.website,
          phone: venue.phone,
          rating: venue.rating,
          Images: [],
          Properties: [],
          YoutubeLinks: [],
          Bookings: [],
        });
      });
    });

    describe('PATCH /user/venues/:id', () => {
      it('updates venue data', async () => {
        const venue = await create('venues', {userId: user.id});
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
          .patch(`/user/venues/${venue.id}`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(200);
        res.body.should.include(options);
        res.body.updatedAt.should.not.eq(venue.updatedAt);
      });

      it("doesn't update venues not owned by the user", async () => {
        const venue = await create('venues', {
          userId: (await create('users')).id,
        });
        const options = {name: 'new name'};
        const res = await chai
          .request(app)
          .patch(`/user/venues/${venue.id}`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(404);
        res.body.error.should.eq('Venue not found.');
      });
    });

    describe('POST /user/venues', () => {
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
          .post(`/user/venues`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(200);
        res.body.should.include(options);
        res.body.userId.should.eq(user.id);
      });

      it("doesn't create a venue for missing data", async () => {
        const options = {active: false};
        const res = await chai
          .request(app)
          .post(`/user/venues`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(500);
        res.body.error.should.eq('Error creating a venue.');
      });
    });

    describe('PATCH :id/youtube_links', () => {
      let venue, linkParams, links, options;

      beforeEach(async () => {
        venue = await create('venues', {userId: user.id});
        linkParams = {
          ownerId: venue.id,
          ownerType: 'Venue',
          userId: user.id,
        };
        links = [
          await create('youtube_links', {...linkParams, link: 'link1'}),
          await create('youtube_links', {...linkParams, link: 'link2'}),
          await create('youtube_links', {...linkParams, link: 'link3'}),
        ];
        options = {
          remove_youtube_link_ids: [links[0].id, links[1].id],
          new_youtube_links: ['link4', 'link5'],
        };
      });

      it('updates the list of youtube links', async () => {
        const res = await chai
          .request(app)
          .patch(`/user/venues/${venue.id}/youtube_links`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(200);
        res.body.length.should.eq(3);
        res.body.should.deep.eq([
          {
            id: links[2].id,
            link: 'link3',
          },
          {
            id: links[2].id + 1,
            link: 'link4',
          },
          {
            id: links[2].id + 2,
            link: 'link5',
          },
        ]);
      });

      it("can't update other user's venue", async () => {
        const otherUser = await create('users');
        const otherToken = await authUser(otherUser);
        const res = await chai
          .request(app)
          .patch(`/user/venues/${venue.id}/youtube_links`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${otherToken}`)
          .send(options);
        res.should.have.status(404);
        res.body.should.deep.eq({error: 'Cannot find venue.'});
      });

      it("can't update other user's youtube links", async () => {
        const otherUser = await create('users');
        const otherLink = await create('youtube_links', {
          ownerId: venue.id,
          ownerType: 'Venue',
          userId: otherUser.id,
          link: 'otherLink',
        });
        options = {
          remove_youtube_link_ids: [otherLink.id],
        };
        const res = await chai
          .request(app)
          .patch(`/user/venues/${venue.id}/youtube_links`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(200);
        res.body.length.should.eq(3);
        res.body.map((r) => r.link).should.deep.eq(['link1', 'link2', 'link3']);
      });
    });

    describe('PATCH :id/properties', () => {
      let venue, properties, options;

      beforeEach(async () => {
        venue = await create('venues', {userId: user.id});
        properties = [
          await create('properties'),
          await create('properties'),
          await create('properties'),
          await create('properties'),
        ];
        await create('properties_venues', {
          propertyId: properties[0].id,
          venueId: venue.id,
        });
        await create('properties_venues', {
          propertyId: properties[1].id,
          venueId: venue.id,
        });
        await create('properties_venues', {
          propertyId: properties[2].id,
          venueId: venue.id,
        });
        (await venue.getProperties()).length.should.eq(3);
        options = {
          property_ids: [properties[2].id, properties[3].id],
        };
      });

      it('updates properties for venue', async () => {
        const res = await chai
          .request(app)
          .patch(`/user/venues/${venue.id}/properties`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(200);
        res.body.length.should.eq(2);
        res.body.should.deep.eq([
          {
            id: properties[2].id,
            name: properties[2].name,
          },
          {
            id: properties[3].id,
            name: properties[3].name,
          },
        ]);
      });

      it("can't update other users venue", async () => {
        const otherUser = await create('users');
        const otherToken = await authUser(otherUser);
        const res = await chai
          .request(app)
          .patch(`/user/venues/${venue.id}/properties`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${otherToken}`)
          .send(options);
        res.should.have.status(404);
        res.body.should.deep.eq({error: 'Cannot find venue.'});
      });
    });

    describe('PATCH :id/images', () => {
      let venue, imageParams, images, options;

      beforeEach(async () => {
        venue = await create('venues', {userId: user.id});
        imageParams = {
          ownerId: venue.id,
          ownerType: 'Venue',
          userId: user.id,
        };
        images = [
          await create('images', {...imageParams, image: 'img1'}),
          await create('images', {...imageParams, image: 'img2'}),
          await create('images', {...imageParams, image: 'img3'}),
        ];
        options = {
          remove_image_ids: [images[0].id, images[1].id],
        };
      });

      it('stores newly uploaded images', async () => {
        const upload = Image.upload;
        Image.upload = () => ['img4', 'img5'];

        const res = await chai
          .request(app)
          .post(`/user/venues/${venue.id}/images`)
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({remove_image_ids: `${images[0].id},${images[1].id}`});

        Image.upload = upload;
        res.should.have.status(200);
        res.body.length.should.eq(3);
        res.body.should.deep.eq([
          {
            id: images[2].id,
            imageUrl: images[2].imageUrl,
            selected: images[2].selected,
          },
          {
            id: images[2].id + 1,
            imageUrl: `${host}/${link}/img4`,
            selected: false,
          },
          {
            id: images[2].id + 2,
            imageUrl: `${host}/${link}/img5`,
            selected: false,
          },
        ]);
      });

      it('updates the list of images', async () => {
        const res = await chai
          .request(app)
          .post(`/user/venues/${venue.id}/images`)
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({remove_image_ids: `${images[0].id},${images[1].id}`});
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body.should.deep.eq([
          {
            id: images[2].id,
            imageUrl: images[2].imageUrl,
            selected: images[2].selected,
          },
        ]);
      });

      it("can't update other user's venue", async () => {
        const otherUser = await create('users');
        const otherToken = await authUser(otherUser);
        const res = await chai
          .request(app)
          .post(`/user/venues/${venue.id}/images`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${otherToken}`)
          .send(options);
        res.should.have.status(404);
        res.body.should.deep.eq({error: 'Cannot find venue.'});
      });
    });
  });
});
