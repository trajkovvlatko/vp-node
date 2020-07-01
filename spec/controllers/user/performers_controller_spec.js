const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../app.js');
const create = require('../../factories');
const {authUser} = require('../../spec_helper');
const Image = require('../../../app/models/image_model.js');
const host = process.env.UPLOAD_HOST;
const link = process.env.UPLOAD_LINK;

chai.use(chaiHttp);
chai.should();

describe('user/performers', () => {
  context('when user is not signed in', () => {
    describe('GET /user/performers', () => {
      it('returns 401', async () => {
        await create('performers', {
          userId: (await create('users')).id,
        });
        const res = await chai.request(app).get(`/user/performers`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('GET /user/performers/active', () => {
      it('returns 401', async () => {
        await create('performers', {
          userId: (await create('users')).id,
        });
        const res = await chai.request(app).get(`/user/performers/active`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('GET /user/performers/:id', () => {
      it('returns 401', async () => {
        const id = (
          await create('performers', {
            userId: (await create('users')).id,
          })
        ).id;
        const res = await chai.request(app).get(`/user/performers/${id}`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('PATCH /user/performers/:id', () => {
      it('returns 401', async () => {
        const id = (
          await create('performers', {
            userId: (await create('users')).id,
          })
        ).id;
        const options = {name: 'new name'};
        const res = await chai
          .request(app)
          .patch(`/user/performers/${id}`)
          .set('content-type', 'application/json')
          .send(options);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('POST /user/performers', () => {
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
          .post(`/user/performers`)
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

    describe('GET /user/performers', () => {
      it('returns empty array for no performers found for user', async () => {
        // performer owned by another user
        await create('performers', {userId: (await create('users')).id});
        const res = await chai
          .request(app)
          .get('/user/performers')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq([]);
      });

      it('returns an array of performers owned by a user', async () => {
        // performer owned by another user
        await create('performers', {userId: (await create('users')).id});

        // own performers
        const performer1 = await create('performers', {userId: user.id});
        const performer2 = await create('performers', {userId: user.id});

        const res = await chai
          .request(app)
          .get('/user/performers')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq([
          {
            id: performer1.id,
            name: performer1.name,
            email: performer1.email,
            imageUrl: '',
            location: performer1.location,
            rating: performer1.rating,
          },
          {
            id: performer2.id,
            name: performer2.name,
            email: performer2.email,
            imageUrl: '',
            location: performer2.location,
            rating: performer2.rating,
          },
        ]);
      });
    });

    describe('GET /user/performers/active', () => {
      it('returns empty array for no active performers found', async () => {
        // inactive performer
        await create('performers', {userId: user.id, active: false});
        const res = await chai
          .request(app)
          .get('/user/performers/active')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq([]);
      });

      it('returns an array of performers owned by a user', async () => {
        // performer owned by another user
        await create('performers', {userId: (await create('users')).id});
        // own performers
        const performer1 = await create('performers', {userId: user.id});
        const performer2 = await create('performers', {userId: user.id});
        // inactive performer
        await create('performers', {userId: user.id, active: false});

        const res = await chai
          .request(app)
          .get('/user/performers/active')
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq([
          {
            id: performer1.id,
            name: performer1.name,
          },
          {
            id: performer2.id,
            name: performer2.name,
          },
        ]);
      });
    });

    describe('GET /user/performers/:id', () => {
      it('returns 404 for performer not found', async () => {
        const res = await chai
          .request(app)
          .get(`/user/performers/-1`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.error.should.eq('Performer not found.');
      });

      it('returns 404 for performer not owned by the user', async () => {
        const tmpUser = await create('users');
        const id = (await create('performers', {userId: tmpUser.id})).id;
        const res = await chai
          .request(app)
          .get(`/user/performers/${id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.error.should.eq('Performer not found.');
      });

      it('returns a performer when owned by a user', async () => {
        const performer = await create('performers', {userId: user.id});
        const res = await chai
          .request(app)
          .get(`/user/performers/${performer.id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq({
          id: performer.id,
          name: performer.name,
          email: performer.email,
          active: performer.active,
          location: performer.location,
          details: performer.details,
          website: performer.website,
          phone: performer.phone,
          rating: performer.rating,
          Images: [],
          Genres: [],
          YoutubeLinks: [],
          Bookings: [],
        });
      });
    });

    describe('PATCH /user/performers/:id', () => {
      it("doesn't update performer not owned by the user", async () => {
        const performer = await create('performers', {
          userId: (await create('users')).id,
        });
        const options = {name: 'new name'};
        const res = await chai
          .request(app)
          .patch(`/user/performers/${performer.id}`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(404);
        res.body.error.should.eq('Performer not found.');
      });

      it('updates performer data', async () => {
        const performer = await create('performers', {userId: user.id});
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
          .patch(`/user/performers/${performer.id}`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(200);
        res.body.should.include(options);
        res.body.updatedAt.should.not.eq(performer.updatedAt);
      });
    });

    describe('POST /user/performers', () => {
      it('fails for missing data', async () => {
        const options = {active: false};
        const res = await chai
          .request(app)
          .post(`/user/performers`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(500);
        res.body.error.should.eq('Error creating a performer.');
      });

      it('creates a new performer', async () => {
        const options = {
          name: 'new name',
          email: 'new email',
          location: 'new location',
          phone: 'new phone',
          details: 'new details',
          website: 'new website',
          active: false,
        };
        const res = await chai
          .request(app)
          .post(`/user/performers`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(200);
        res.body.should.include(options);
        res.body.userId.should.eq(user.id);
      });
    });

    describe('PATCH :id/youtube_links', () => {
      let performer, linkParams, links, options;

      beforeEach(async () => {
        performer = await create('performers', {userId: user.id});
        linkParams = {
          ownerId: performer.id,
          ownerType: 'Performer',
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
          .patch(`/user/performers/${performer.id}/youtube_links`)
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

      it("can't update other user's performer", async () => {
        const otherUser = await create('users');
        const otherToken = await authUser(otherUser);
        const res = await chai
          .request(app)
          .patch(`/user/performers/${performer.id}/youtube_links`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${otherToken}`)
          .send(options);
        res.should.have.status(404);
        res.body.should.deep.eq({error: 'Cannot find performer.'});
      });

      it("can't update other user's youtube links", async () => {
        const otherUser = await create('users');
        const otherLink = await create('youtube_links', {
          ownerId: performer.id,
          ownerType: 'Performer',
          userId: otherUser.id,
          link: 'otherLink',
        });
        options = {
          remove_youtube_link_ids: [otherLink.id],
        };
        const res = await chai
          .request(app)
          .patch(`/user/performers/${performer.id}/youtube_links`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(200);
        res.body.length.should.eq(3);
        res.body.map((r) => r.link).should.deep.eq(['link1', 'link2', 'link3']);
      });
    });

    describe('PATCH :id/genres', () => {
      let performer, genres, options;

      beforeEach(async () => {
        performer = await create('performers', {userId: user.id});
        genres = [
          await create('genres'),
          await create('genres'),
          await create('genres'),
          await create('genres'),
        ];
        await create('genres_performers', {
          genreId: genres[0].id,
          performerId: performer.id,
        });
        await create('genres_performers', {
          genreId: genres[1].id,
          performerId: performer.id,
        });
        await create('genres_performers', {
          genreId: genres[2].id,
          performerId: performer.id,
        });
        (await performer.getGenres()).length.should.eq(3);
        options = {
          genre_ids: [genres[2].id, genres[3].id],
        };
      });

      it('updates genres for performer', async () => {
        const res = await chai
          .request(app)
          .patch(`/user/performers/${performer.id}/genres`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .send(options);
        res.should.have.status(200);
        res.body.length.should.eq(2);
        res.body.should.deep.eq([
          {
            id: genres[2].id,
            name: genres[2].name,
          },
          {
            id: genres[3].id,
            name: genres[3].name,
          },
        ]);
      });

      it("can't update other users performer", async () => {
        const otherUser = await create('users');
        const otherToken = await authUser(otherUser);
        const res = await chai
          .request(app)
          .patch(`/user/performers/${performer.id}/genres`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${otherToken}`)
          .send(options);
        res.should.have.status(404);
        res.body.should.deep.eq({error: 'Cannot find performer.'});
      });
    });

    describe('PATCH :id/images', () => {
      let performer, imageParams, images, options;

      beforeEach(async () => {
        performer = await create('performers', {userId: user.id});
        imageParams = {
          ownerId: performer.id,
          ownerType: 'Performer',
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
          .post(`/user/performers/${performer.id}/images`)
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
          .post(`/user/performers/${performer.id}/images`)
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

      it("can't update other user's performer", async () => {
        const otherUser = await create('users');
        const otherToken = await authUser(otherUser);
        const res = await chai
          .request(app)
          .post(`/user/performers/${performer.id}/images`)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${otherToken}`)
          .send(options);
        res.should.have.status(404);
        res.body.should.deep.eq({error: 'Cannot find performer.'});
      });
    });
  });
});
