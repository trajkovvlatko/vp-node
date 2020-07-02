const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const secret = process.env.JWT_SECRET;
const User = require('../models/user_model.js');

/* POST login. */
router.post('/login', function (req, res) {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        error: info && info.message,
        user: user,
      });
    }

    req.login(user.dataValues, {session: false}, (err) => {
      if (err) {
        return res.send(err);
      }
      const token = jwt.sign(user.dataValues, secret);
      return res.json({token, name: user.name, email: user.email});
    });
  })(req, res);
});

/* POST register. */
router.post('/register', async function (req, res) {
  try {
    const {name, email, password} = {...req.body};
    if (!name || !email || !password) {
      return res.status(422).send({error: 'Unprocessable entry.'});
    }
    const user = await User.register(name, email, password);
    res.send({
      name: user.name,
      email: user.email,
    });
  } catch (e) {
    const errors = e.errors.map((obj) => obj.message);
    res.status(500).send({error: errors});
  }
});

module.exports = router;
