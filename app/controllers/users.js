const express = require('express');
const router = express.Router();

/* GET user profile. */
router.get('/', function(req, res, next) {
  res.send(req.user.data);
});

module.exports = router;
