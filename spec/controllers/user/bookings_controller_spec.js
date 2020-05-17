const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../app.js');
const create = require('../../factories');
const {authUser} = require('../../spec_helper');

chai.use(chaiHttp);
chai.should();

describe('user/bookings', async () => {
  let user, otherUser, performer, venue, pending;

  beforeEach(async () => {
    user = await create('users');
    otherUser = await create('users');
    performer = await create('performers', {userId: user.id});
    venue = await create('venues', {userId: user.id});
    pending = await create('bookings', {
      fromUserId: user.id,
      toUserId: otherUser.id,
      requesterType: 'Performer',
      requesterId: performer.id,
      requestedType: 'Venue',
      requestedId: venue.id,
    });
  });

  context('when user is not signed in', () => {
    describe('user/bookings/requested', () => {
      it('returns 401', async () => {
        const res = await chai.request(app).get(`/user/bookings/requested`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('user/bookings/upcoming', () => {
      it('returns 401', async () => {
        const res = await chai.request(app).get(`/user/bookings/upcoming`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('user/bookings/:id', () => {
      it('returns 401', async () => {
        const res = await chai.request(app).get(`/user/bookings/${pending.id}`);
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });

    describe('user/bookings/:dateTime/:requesterType/:requesterId/:requestedType/:requestedId', () => {
      it('returns 401', async () => {
        const res = await chai
          .request(app)
          .post(
            `/user/bookings/2010-01-01/venue/${venue.id}/performer/${performer.id}`,
          );
        res.should.have.status(401);
        res.body.should.deep.eq({});
      });
    });
  });

  context('when user is signed in', () => {
    let token;

    beforeEach(async () => {
      token = await authUser(user);
    });

    describe('user/bookings/requested', () => {
      it('returns list of requested bookings', async () => {
        const requested = await create('bookings', {
          fromUserId: otherUser.id,
          toUserId: user.id,
          requesterType: 'Performer',
          requesterId: performer.id,
          requestedType: 'Venue',
          requestedId: venue.id,
          status: 'requested',
        });
        // the one that 'user' requested
        await create('bookings', {
          fromUserId: user.id,
          toUserId: otherUser.id,
          requesterType: 'Performer',
          requesterId: performer.id,
          requestedType: 'Venue',
          requestedId: venue.id,
          status: 'requested',
        });
        // from the correct user, but pending
        await create('bookings', {
          fromUserId: otherUser.id,
          toUserId: user.id,
          requesterType: 'Performer',
          requesterId: performer.id,
          requestedType: 'Venue',
          requestedId: venue.id,
          status: 'pending',
        });
        const res = await chai
          .request(app)
          .get(`/user/bookings/requested`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body[0].should.deep.eq({
          id: requested.id,
          requestedType: requested.requestedType,
          requestedId: requested.requestedId,
          requesterType: requested.requesterType,
          requesterId: requested.requesterId,
          bookingDate: requested.bookingDate,
          performerName: performer.name,
          venueName: venue.name,
        });
      });
    });

    describe('user/bookings/upcoming', () => {
      it('returns list of upcoming bookings', async () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date(today);
        yesterday.setDate(tomorrow.getDate() - 1);
        const accepted = await create('bookings', {
          fromUserId: otherUser.id,
          toUserId: user.id,
          requesterType: 'Performer',
          requesterId: performer.id,
          requestedType: 'Venue',
          requestedId: venue.id,
          bookingDate: tomorrow,
          status: 'accepted',
        });
        const canceled = await create('bookings', {
          fromUserId: user.id,
          toUserId: otherUser.id,
          requesterType: 'Performer',
          requesterId: performer.id,
          requestedType: 'Venue',
          requestedId: venue.id,
          bookingDate: tomorrow,
          status: 'canceled',
        });
        // other status
        await create('bookings', {
          fromUserId: user.id,
          toUserId: otherUser.id,
          requesterType: 'Performer',
          requesterId: performer.id,
          requestedType: 'Venue',
          requestedId: venue.id,
          bookingDate: tomorrow,
          status: 'pending',
        });
        // old one
        await create('bookings', {
          fromUserId: user.id,
          toUserId: otherUser.id,
          requesterType: 'Performer',
          requesterId: performer.id,
          requestedType: 'Venue',
          requestedId: venue.id,
          bookingDate: yesterday,
          status: 'canceled',
        });
        // from other users
        await create('bookings', {
          fromUserId: otherUser.id,
          toUserId: otherUser.id,
          requesterType: 'Performer',
          requesterId: performer.id,
          requestedType: 'Venue',
          requestedId: venue.id,
          bookingDate: tomorrow,
          status: 'canceled',
        });
        const res = await chai
          .request(app)
          .get(`/user/bookings/upcoming`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.length.should.eq(2);
        res.body.should.deep.eq([
          {
            id: accepted.id,
            bookingDate: accepted.bookingDate,
            status: accepted.status,
            performerId: performer.id,
            performerName: performer.name,
            venueId: venue.id,
            venueName: venue.name,
          },
          {
            id: canceled.id,
            bookingDate: canceled.bookingDate,
            status: canceled.status,
            performerId: performer.id,
            performerName: performer.name,
            venueId: venue.id,
            venueName: venue.name,
          },
        ]);
      });
    });

    describe('user/bookings/:id', () => {
      it('returns a booking by id', async () => {
        const booking = await create('bookings', {
          fromUserId: user.id,
          toUserId: otherUser.id,
          requesterType: 'Performer',
          requesterId: performer.id,
          requestedType: 'Venue',
          requestedId: venue.id,
          bookingDate: '2010-01-01',
          status: 'canceled',
        });
        // other booking
        await create('bookings', {
          fromUserId: user.id,
          toUserId: otherUser.id,
          requesterType: 'Performer',
          requesterId: performer.id,
          requestedType: 'Venue',
          requestedId: venue.id,
          bookingDate: '2010-01-01',
          status: 'canceled',
        });
        const res = await chai
          .request(app)
          .get(`/user/bookings/${booking.id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.deep.eq({
          id: booking.id,
          requesterType: booking.requesterType,
          requesterId: booking.requesterId,
          requestedType: booking.requestedType,
          requestedId: booking.requestedId,
          status: booking.status,
          bookingDate: booking.bookingDate,
          performerId: performer.id,
          performerName: performer.name,
          venueId: venue.id,
          venueName: venue.name,
        });
      });

      it("doesn't return other user's bookings", async () => {
        const booking = await create('bookings', {
          fromUserId: otherUser.id,
          toUserId: otherUser.id,
          requesterType: 'Performer',
          requesterId: performer.id,
          requestedType: 'Venue',
          requestedId: venue.id,
          bookingDate: '2010-01-01',
          status: 'canceled',
        });
        const res = await chai
          .request(app)
          .get(`/user/bookings/${booking.id}`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.should.deep.eq({error: 'Cannot find booking.'});
      });
    });

    describe('user/bookings/:date/:requesterType/:requesterId/:requestedType/:requestedId', () => {
      it('creates a booking', async () => {
        otherVenue = await create('venues', {userId: otherUser.id});
        const res = await chai
          .request(app)
          .post(
            `/user/bookings/2010-01-01/performer/${performer.id}/venue/${otherVenue.id}`,
          )
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.have.property('id').that.is.a('number');
        res.body.status.should.eq('requested');
        Object.keys(res.body).should.deep.eq(['id', 'status']);
      });

      it('fails if requester performer is not owned', async () => {
        otherPerformer = await create('venues', {userId: otherUser.id});
        otherVenue = await create('venues', {userId: otherUser.id});
        const res = await chai
          .request(app)
          .post(
            `/user/bookings/2010-01-01/performer/${otherPerformer.id}/venue/${otherVenue.id}`,
          )
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.should.deep.eq({error: 'Cannot find performer.'});
      });

      it('fails if requester venue is not owned', async () => {
        otherPerformer = await create('venues', {userId: otherUser.id});
        otherVenue = await create('venues', {userId: otherUser.id});
        const res = await chai
          .request(app)
          .post(
            `/user/bookings/2010-01-01/venue/${otherVenue.id}/performer/${otherPerformer.id}`,
          )
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.should.deep.eq({error: 'Cannot find venue.'});
      });

      it('fails if requested performer is not found', async () => {
        const res = await chai
          .request(app)
          .post(`/user/bookings/2010-01-01/venue/${venue.id}/performer/-1`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.should.deep.eq({error: 'Cannot find performer.'});
      });

      it('fails if requested venue is not found', async () => {
        const res = await chai
          .request(app)
          .post(`/user/bookings/2010-01-01/performer/${performer.id}/venue/-1`)
          .set('Authorization', `Bearer ${token}`);
        res.should.have.status(404);
        res.body.should.deep.eq({error: 'Cannot find venue.'});
      });
    });

    describe('patch user/bookings/:id', () => {
      it('updates a booking', async () => {
        pending.status.should.eq('pending');
        const res = await chai
          .request(app)
          .patch(`/user/bookings/${pending.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({status: 'canceled'});
        res.should.have.status(200);
        res.body.should.deep.eq({id: pending.id, status: 'canceled'});
      });

      it('accepts certain values for booking status', async () => {
        pending.status.should.eq('pending');
        async function run(status) {
          const res = await chai
            .request(app)
            .patch(`/user/bookings/${pending.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({status});
          res.should.have.status(200);
          res.body.should.deep.eq({id: pending.id, status});
        }
        for (const status of ['accepted', 'rejected', 'canceled']) {
          await run(status);
        }
      });

      it("doesn't update other people's bookings", async () => {
        const otherBooking = await create('bookings', {
          fromUserId: otherUser.id,
          toUserId: otherUser.id,
          requesterId: performer.id,
          requesterType: 'Performer',
          requestedId: venue.id,
          requestedType: 'Venue',
        });
        const res = await chai
          .request(app)
          .patch(`/user/bookings/${otherBooking.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({status: 'canceled'});
        res.should.have.status(404);
        res.body.should.deep.eq({error: 'Cannot find booking.'});
      });
    });
  });
});
