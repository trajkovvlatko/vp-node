const express = require('express');
const router = express.Router();
const BookingModel = require('../../models/booking_model.js');
const VenueModel = require('../../models/venue_model.js');
const PerformerModel = require('../../models/performer_model.js');

/* GET list */
router.get('/', async function(req, res, next) {
  const results = await BookingModel.requestedForUser(req.user.data.id);
  if (results.error) {
    return res.status(500).send(results);
  } else {
    res.send(results);
  }
});

/* GET id */
router.get('/:id', async function(req, res, next) {
  const result = await BookingModel.findForUser(
    req.user.data.id,
    req.params.id,
  );
  if (result.error) {
    return res.status(500).send(result);
  } else {
    res.send(result);
  }
});

/* POST create */
router.post(
  '/:dateTime/:requesterType/:requesterId/:requestedType/:requestedId',
  async function(req, res, next) {
    const {
      dateTime,
      requestedType,
      requestedId,
      requesterType,
      requesterId,
    } = req.params;

    const model = requestedType === 'venue' ? VenueModel : PerformerModel;
    const requested = await model.basicFind(requestedId);
    if (requested.error) return res.status(400).send(requested);

    const result = await BookingModel.createForUser(req.user.data.id, {
      toUserId: requested.user_id,
      requesterType,
      requesterId,
      requestedType,
      requestedId,
      status: 'requested',
      bookingDate: dateTime,
    });
    if (result.error) {
      return res.status(500).send(result);
    } else {
      res.send({state: result.status});
    }
  },
);

/* PATCH id */
router.patch('/:id', async function(req, res, next) {
  const result = await BookingModel.updateForUser(
    req.user.data.id,
    req.params.id,
    {status: req.body.status},
  );

  if (result.error) {
    return res.status(500).send(result);
  } else {
    res.send(result);
  }
});

module.exports = router;
