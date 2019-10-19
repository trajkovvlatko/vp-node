const express = require('express');
const router = express.Router();
const GenreModel = require('../models/genre_model.js');

/* GET index */
router.get('/', async function(req, res, next) {
  const genres = await GenreModel.all();
  res.send(genres);
});

module.exports = router;
