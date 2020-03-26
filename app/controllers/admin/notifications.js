const express = require('express');
const router = express.Router();
const BookingModel = require('../../models/booking_model.js');

/* GET list */
router.get('/', async function(req, res, next) {
  const results = await BookingModel.requestedForUser(req.user.data.id);
  if (results.error) {
    return res.status(500).send(results);
  } else {
    const list = results.map(row => {
      let message;
      if (row.requester_type === 'performer') {
        message = `Performer ${row.performer_name} requested to perform on venue ${row.venue_name}`;
      } else {
        message = `Venue ${row.venue_name} invites ${row.performer_name} to perform`;
      }
      return {id: row.id, message};
    });
    res.send(list);
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

module.exports = router;
