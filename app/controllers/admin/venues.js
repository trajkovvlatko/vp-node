const express = require('express');
const router = express.Router();
const UserModel = require('../../models/user_model.js');

/* GET index */
router.get('/', async function(req, res, next) {
  const venues = await req.user.venues();
  res.send(venues);
});

/* GET show */
router.get('/:id', async function(req, res, next) {
  const venue = await req.user.venue(req.params.id);
  res.status(venue.error ? 404 : 200).send(venue);
});

/* PATCH update */
router.patch('/:id', async function(req, res, next) {
  const venue = await req.user.updateVenue({...req.params, ...req.body});
  if (!venue.error) {
    res.send(venue);
  } else {
    res.status(404).send(venue);
  }
});

module.exports = router;
