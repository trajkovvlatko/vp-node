const express = require('express');
const router = express.Router();
const PerformerModel = require('../models/performer_model.js');

/* GET index */
router.get('/', async function(req, res, next) {
  let limit = parseInt(req.query.limit);
  if (isNaN(limit) || limit > 10) limit = 10;
  const performers = await PerformerModel.all(req.query.sorting, limit);
  res.send(performers);
});

/* GET show */
router.get('/:id', async function(req, res, next) {
  const performer = await PerformerModel.find(req.params.id);
  res.status(performer.error ? 404 : 200).send(performer);
});

module.exports = router;
