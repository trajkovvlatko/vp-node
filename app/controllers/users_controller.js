const express = require('express');
const router = express.Router();

/* GET user profile. */
router.get('/', function (req, res) {
  res.send(req.user);
});

module.exports = router;
