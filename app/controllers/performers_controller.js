const express = require('express');
const router = express.Router();
const {Performer} = require('../models');

/* GET index */
router.get('/', async function (req, res) {
  let limit = parseInt(req.query.limit);
  if (isNaN(limit) || limit > 10) limit = 10;

  const response = await Performer.allActive(
    req.query.sorting,
    limit,
    req.query.offset,
  );
  if (response.error) {
    res.status(500).send(response);
  } else {
    res.send(
      response.map((performer) => {
        const p = performer.dataValues;
        return {
          id: p.id,
          name: p.name,
          type: 'performer',
          rating: p.rating || 0,
          imageUrl: performer.Images[0].get('imageUrl'),
        };
      }),
    );
  }
});

/* GET show */
router.get('/:id', async function (req, res) {
  const performer = await Performer.find(req.params.id);
  if (performer) {
    res.send(performer);
  } else {
    res.status(404).send({error: 'Record not found.'});
  }
});

module.exports = router;
