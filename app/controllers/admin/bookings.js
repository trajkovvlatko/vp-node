const express = require('express');
const router = express.Router();
const BookingModel = require('../../models/booking_model.js');
const VenueModel = require('../../models/venue_model.js');
const PerformerModel = require('../../models/performer_model.js');

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
  }
);

module.exports = router;
