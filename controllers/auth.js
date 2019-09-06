const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const fs = require('fs');
const secret = JSON.parse(fs.readFileSync('./config/secrets.json')).JWT.secret;

/* POST login. */
router.post('/login', function(req, res, next) {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err || !user) {
      console.log('controllers/auth.js', err);
      return res.status(400).json({
        message: 'Something is not right',
        user: user,
      });
    }

    req.login(user, {session: false}, err => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(user, secret);
      return res.json({token});
    });
  })(req, res);
});

module.exports = router;
