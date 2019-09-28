const express = require('express');
const router = express.Router();
const UserModel = require('../../models/user_model.js');

/* GET index */
router.get('/', async function(req, res, next) {
  const performers = await req.user.performers();
  res.send(performers);
});

/* GET show */
router.get('/:id', async function(req, res, next) {
  const performer = await req.user.performer(id);
  res.send(performer);
});

module.exports = router;
