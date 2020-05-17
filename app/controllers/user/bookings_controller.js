const express = require('express');
const router = express.Router();
const {Venue, Performer} = require('../../models');

/* GET requested list */
router.get('/requested', async function (req, res) {
  try {
    const results = await req.user.getRequestedBookings({
      attributes: [
        'id',
        'bookingDate',
        'requesterType',
        'requesterId',
        'requestedType',
        'requestedId',
      ],
      where: {
        status: 'requested',
      },
    });
    const performers = await getUsedRecords(results, Performer);
    const venues = await getUsedRecords(results, Venue);
    res.send(
      results.map((r) => {
        return {
          ...r.dataValues,
          performerName:
            r.requestedType === 'Performer'
              ? performers[r.requestedId]
              : performers[r.requesterId],
          venueName:
            r.requestedType === 'Venue'
              ? venues[r.requestedId]
              : venues[r.requesterId],
        };
      }),
    );
  } catch (e) {
    res.status(500).send({error: 'Error fetching requested bookings.'});
  }
});

/* GET upcoming list */
router.get('/upcoming', async function (req, res) {
  try {
    const results = await req.user.upcomingBookings();
    const performers = await getUsedRecords(results, Performer);
    const venues = await getUsedRecords(results, Venue);
    res.send(
      results.map((r) => {
        return {
          id: r.id,
          status: r.status,
          bookingDate: r.bookingDate,
          performerId:
            r.requestedType === 'Performer' ? r.requestedId : r.requesterId,
          performerName:
            r.requestedType === 'Performer'
              ? performers[r.requestedId]
              : performers[r.requesterId],
          venueId: r.requestedType === 'Venue' ? r.requestedId : r.requesterId,
          venueName:
            r.requestedType === 'Venue'
              ? venues[r.requestedId]
              : venues[r.requesterId],
        };
      }),
    );
  } catch (e) {
    res.status(500).send({error: 'Error fetching upcoming bookings.'});
  }
});

/* GET id */
router.get('/:id', async function (req, res) {
  try {
    const result = await req.user.findBooking(req.params.id);
    if (result) {
      const performer = await getUsedRecords([result], Performer);
      const venue = await getUsedRecords([result], Venue);
      res.send({
        ...result.dataValues,
        performerId: parseInt(Object.keys(performer)[0]),
        performerName: Object.values(performer)[0],
        venueId: parseInt(Object.keys(venue)[0]),
        venueName: Object.values(venue)[0],
      });
    } else {
      res.status(404).send({error: 'Cannot find booking.'});
    }
  } catch (e) {
    res.status(500).send({error: 'Error fetching booking.'});
  }
});

/* POST create */
router.post(
  '/:date/:requesterType/:requesterId/:requestedType/:requestedId',
  async function (req, res) {
    const {
      date,
      requestedType,
      requestedId,
      requesterType,
      requesterId,
    } = req.params;

    const requester = await getRequester(req, res, requesterType, requesterId);
    if (!requester) return;

    const requested = await getRequested(res, requestedType, requestedId);
    if (!requested) return;

    try {
      const result = await req.user.createBooking({
        toUserId: requested.userId,
        requesterType,
        requesterId,
        requestedType,
        requestedId,
        date,
        status: 'requested',
      });
      res.send({id: result.id, status: result.status});
    } catch (e) {
      console.log(e);
      return res.status(500).send({error: 'Error while creating a booking.'});
    }
  },
);

/* PATCH id */
router.patch('/:id', async function (req, res) {
  // TODO: Should limit which user can approve, reject and cancel
  const status = req.body.status;
  if (!status || ['accepted', 'rejected', 'canceled'].indexOf(status) === -1) {
    return res.status(422).send({error: 'Unprocessable Entity.'});
  }

  try {
    const booking = await req.user.findBooking(req.params.id);
    if (!booking || booking.error) {
      return res.status(404).send({error: 'Cannot find booking.'});
    }
    booking.status = status;
    await booking.save();
    res.send({id: booking.id, status: booking.status});
  } catch (e) {
    res.status(500).send({error: 'Error while updating booking.'});
  }
});

async function getRequester(req, res, requesterType, requesterId) {
  let requester;
  if (requesterType === 'venue') {
    requester = await req.user.getVenues({
      attributes: [],
      where: {id: requesterId},
    });
  } else if (requesterType === 'performer') {
    requester = await req.user.getPerformers({
      attributes: [],
      where: {id: requesterId},
    });
  } else {
    res.status(422).send({error: 'Unprocessable Entity.'});
    return;
  }

  requester = requester[0];
  if (!requester) {
    res.status(404).send({error: `Cannot find ${requesterType}.`});
    return;
  }
  return requester;
}

async function getRequested(res, requestedType, requestedId) {
  let requested;
  if (requestedType === 'venue') {
    requested = await Venue.findByPk(requestedId, {
      attributes: ['userId'],
    });
  } else if (requestedType === 'performer') {
    requested = await Performer.findByPk(requestedId, {
      attributes: ['userId'],
    });
  } else {
    res.status(422).send({error: 'Unprocessable Entity.'});
    return;
  }
  if (!requested) {
    res.status(404).send({error: `Cannot find ${requestedType}.`});
    return;
  }
  return requested;
}

async function getUsedRecords(results, klass) {
  const ids = results.map((r) => {
    return r.requesterType === klass.name ? r.requesterId : r.requestedId;
  });
  const dbRecords = await klass.findAll({
    attributes: ['id', 'name'],
    where: {id: ids},
  });
  return dbRecords.reduce((map, p) => {
    map[p.dataValues.id] = p.dataValues.name;
    return map;
  }, {});
}

module.exports = router;
