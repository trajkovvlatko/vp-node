const express = require('express');
const router = express.Router();
const Genre = require('../models/genre_model.js');

/* GET index */
router.get('/', async function (req, res, next) {
  const genres = await Genre.allActive();
  res.send(genres);
});

module.exports = router;
