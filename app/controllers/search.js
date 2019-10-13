const express = require('express');
const router = express.Router();
const VenueModel = require('../models/venue_model.js');
const PerformerModel = require('../models/performer_model.js');

/* GET */
router.get('/', async function(req, res, next) {
  const {location, date, genres} = req.query;
  if (!location) {
    return res.status(422).send({error: 'Location not provided.'});
  }

  let params = {location: location};
  if (date) params.date = date;
  if (genres) params.genres = genres.split(',');

  let results;
  if (req.query.type === 'venue') {
    results = await VenueModel.search(params);
  } else {
    results = await PerformerModel.search(params);
  }
  res.send(results);
});

module.exports = router;
