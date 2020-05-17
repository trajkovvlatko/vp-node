const express = require('express');
const router = express.Router();
const {Venue} = require('../models');

/* GET index */
router.get('/', async function (req, res) {
  let limit = parseInt(req.query.limit);
  if (isNaN(limit) || limit > 10) limit = 10;

  const response = await Venue.allActive(
    req.query.sorting,
    limit,
    req.query.offset,
  );
  if (response.error) {
    res.status(500).send(response);
  } else {
    res.send(
      response.map((venue) => {
        const v = venue.dataValues;
        return {
          id: v.id,
          name: v.name,
          type: 'venue',
          rating: v.rating,
          image: venue.Images[0].dataValues.image,
        };
      }),
    );
  }
});

/* GET show */
router.get('/:id', async function (req, res, next) {
  const venue = await Venue.find(req.params.id);
  if (venue) {
    res.send(venue);
  } else {
    res.status(404).send({error: 'Record not found.'});
  }
});

module.exports = router;
