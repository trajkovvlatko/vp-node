const express = require('express');
const router = express.Router();
const db = require('../../config/database');

router.get('/', async function(req, res, next) {
  try {
    await db.one(`SELECT 1 + 1`);
    res.send({success: true});
  } catch (_) {
    res.status(500).send({error: 'Cannot select from database.'});
  }
});

module.exports = router;
