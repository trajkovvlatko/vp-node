const express = require('express');
const router = express.Router();
const VenueModel = require('../models/venue_model.js');

/* GET index */
router.get('/', async function(req, res, next) {
  const venues = await VenueModel.all();
  res.send(venues);
});

/* GET show */
router.get('/:id', async function(req, res, next) {
  const venue = await VenueModel.find(req.params.id);
  res.status(venue.error ? 404 : 200).send(venue);
});

module.exports = router;
