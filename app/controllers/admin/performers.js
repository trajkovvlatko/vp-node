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

/* PATCH update */
router.patch('/:id', async function(req, res, next) {
  const performer = await req.user
    .performers()
    .update({...req.params, ...req.body});
  if (!performer.error) {
    res.send(performer);
  } else {
    res.status(404).send(performer);
  }
});

/* POST create */
router.post('/', async function(req, res, next) {
  const performer = await req.user.performers().create(req.body);
  if (!performer.error) {
    res.send(performer);
  } else {
    res.status(500).send(performer);
  }
});

module.exports = router;
