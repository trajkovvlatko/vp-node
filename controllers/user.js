const express = require('express');
const router = express.Router();

/* GET user profile. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.send(req.user.data);
});

module.exports = router;
