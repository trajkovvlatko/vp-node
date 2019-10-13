const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const create = require('../factories');
require('../spec_helper');

chai.use(chaiHttp);
chai.should();

describe('search', () => {
  it('returns an error for missing location parameter', async () => {
    const res = await chai.request(app).get(`/search?type=performer`);
    res.should.have.status(422);
    res.body.error.should.eq('Location not provided.');
  });

  context('when nothing is matched', () => {
    it('returns empty array for no performers found', async () => {
      const res = await chai
        .request(app)
        .get(`/search?location=sweden&type=performer`);
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });

    it('returns empty array for no venues found', async () => {
      const res = await chai
        .request(app)
        .get('/search?location=swedentype=venue');
      res.should.have.status(200);
      res.body.should.deep.eq([]);
    });
  });

  context('when some are matched', () => {
    context('performers', () => {
      it('returns array when performers are found by location', async () => {
        const id = (await create('performers', {
          userId: (await create('users')).id,
          location: 'sweden',
        })).id;
        await create('performers', {
          userId: (await create('users')).id,
          location: 'denmark',
        });
        const path = `/search?type=performer&location=sweden`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body[0].id.should.eq(id);
      });

      it('returns array when performers are found by genre', async () => {
        const performerId = (await create('performers', {
          userId: (await create('users')).id,
          location: 'sweden',
        })).id;
        const genreId = (await create('genres', {name: 'genre name'})).id;
        await create('genres_performers', {
          genre_id: genreId,
          performer_id: performerId,
        });

        const path = `/search?type=performer&location=sweden&genres=${genreId}`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body[0].id.should.eq(performerId);
      });

      it('adds results that match at least one of the requested', async () => {
        user = await create('users');
        const performer1 = await create('performers', {
          userId: user.id,
          location: 'sweden',
        });
        const performer2 = await create('performers', {
          userId: user.id,
          location: 'sweden',
        });
        await create('performers', {
          userId: user.id,
          location: 'sweden',
        });

        const genre1 = await create('genres', {name: 'genre1'});
        const genre2 = await create('genres', {name: 'genre2'});
        await create('genres', {name: 'genre3'});

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

        const path = `/search?type=performer&location=sweden&genres=${
          genre1.id
        },${genre2.id}`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(2);
        res.body
          .map(p => {
            return p.id;
          })
          .should.deep.eq([performer1.id, performer2.id]);
      });
    });

    context('venues', () => {
      it('returns array when venues are found by location', async () => {
        const id = (await create('venues', {
          userId: (await create('users')).id,
          location: 'sweden',
        })).id;
        await create('venues', {
          userId: (await create('users')).id,
          location: 'denmark',
        });
        const path = `/search?type=venue&location=sweden`;
        const res = await chai.request(app).get(path);
        res.should.have.status(200);
        res.body.length.should.eq(1);
        res.body[0].id.should.eq(id);
      });
    });
  });
});
