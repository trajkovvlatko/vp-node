const express = require('express');
const router = express.Router();
const PerformerModel = require('../models/performer_model.js');

/* GET index */
router.get('/', async function(req, res, next) {
  const performers = await PerformerModel.all();
  res.send(performers);
});

/* GET show */
router.get('/id', async function(req, res, next) {
  // TODO: dynamic id param
  const id = 6;
  const performer = await PerformerModel.find(id);
  res.send(performer);
});

module.exports = router;
