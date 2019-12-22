const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const fs = require('fs');
const secret = JSON.parse(fs.readFileSync('./config/secrets.json')).JWT.secret;
const UserModel = require('../models/user_model.js');

/* POST login. */
router.post('/login', function(req, res, next) {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        error: info.message,
        user: user,
      });
    }

    req.login(user, {session: false}, err => {
      if (err) {
        return res.send(err);
      }
      const token = jwt.sign(user, secret);
      return res.json({token});
    });
  })(req, res);
});

/* POST register. */
router.post('/register', async function(req, res, next) {
  const user = await UserModel.create(req.body)
  if (!user.error) {
    res.send(user.data);
  } else {
    res.status(500).send({ error: user.error.detail });
  }
});

module.exports = router;
