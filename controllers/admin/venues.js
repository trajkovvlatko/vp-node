const express = require('express');
const router = express.Router();
const UserModel = require('../../models/user_model.js');

/* GET index. */
router.get('/', async function(req, res, next) {
  const venues = await req.user.venues();
  res.send(venues);
});

/* GET index. */
router.get('/id', async function(req, res, next) {
  // TODO: dynamic id param
  const id = 1;
  const venue = await req.user.venue(id);
  res.send(venue);
});

module.exports = router;
