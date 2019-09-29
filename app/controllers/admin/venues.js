const express = require('express');
const router = express.Router();
const UserModel = require('../../models/user_model.js');

/* GET index */
router.get('/', async function(req, res, next) {
  const venues = await req.user.venues().all();
  res.send(venues);
});

/* GET show */
router.get('/:id', async function(req, res, next) {
  const venue = await req.user.venues().find(req.params.id);
  res.status(venue.error ? 404 : 200).send(venue);
});

/* PATCH update */
router.patch('/:id', async function(req, res, next) {
  const venue = await req.user.venues().update({...req.params, ...req.body});
  if (!venue.error) {
    res.send(venue);
  } else {
    res.status(404).send(venue);
  }
});

/* POST create */
router.post('/', async function(req, res, next) {
  const venue = await req.user.venues().create(req.body);
  if (!venue.error) {
    res.send(venue);
  } else {
    res.status(500).send(venue);
  }
});

module.exports = router;
