const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.send({a: 1});
});

module.exports = router;
