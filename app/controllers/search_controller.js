const express = require('express');
const router = express.Router();
const Venue = require('../models/venue_model.js');
const Performer = require('../models/performer_model.js');

/* GET */
router.get('/:type/:location', async function(req, res, next) {
  const {date, genres, properties} = req.query;
  let params = {location: req.params.location};
  if (date) params.date = date;
  if (genres) params.genres = genres.split(',');
  if (properties) params.properties = properties.split(',');

  let results;
  if (req.params.type === 'venues') {
    results = await Venue.search(params);
  } else if (req.params.type === 'performers') {
    results = await Performer.search(params);
  } else {
    results = [];
  }
  res.send(results);
});

module.exports = router;
