const express = require('express');
const router = express.Router();
const VenueModel = require('../models/venue_model.js');

/* GET index */
router.get('/', async function (req, res, next) {
  let limit = parseInt(req.query.limit);
  if (isNaN(limit) || limit > 10) limit = 10;
  const venues = await VenueModel.all(req.query.sorting, limit);
  res.send(venues);
});

/* GET show */
router.get('/:id', async function (req, res, next) {
  const venue = await VenueModel.find(req.params.id);
  res.status(venue.error ? 404 : 200).send(venue);
});

module.exports = router;
