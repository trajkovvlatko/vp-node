const express = require('express');
const router = express.Router();
const UserModel = require('../../models/user_model.js');

/* GET index */
router.get('/', async function(req, res, next) {
  const performers = await req.user.performers().all();
  res.send(performers);
});

/* GET show */
router.get('/:id', async function(req, res, next) {
  const performer = await req.user.performers().find(req.params.id);
  res.status(performer.error ? 404 : 200).send(performer);
});

module.exports = router;
