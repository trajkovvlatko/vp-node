const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const fs = require('fs');
const secret = JSON.parse(fs.readFileSync('./config/secrets.json')).JWT.secret;
const UserModel = require('../app/models/user_model.js');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },

    async function(email, password, cb) {
      // this one is typically a DB call.
      // Assume that the returned user object is pre-formatted
      // and ready for storing in JWT
      return await UserModel.findByCredentials(email, password)
        .then(resp => {
          if (!resp) {
            return cb(null, false, {message: 'Incorrect email or password.'});
          }
          return cb(null, resp, {message: 'Logged In Successfully'});
        })
        .catch(err => cb(err));
    },
  ),
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    },
    async function(jwtPayload, cb) {
      // find the user in db if needed.
      // This functionality may be omitted if you store everything you'll need
      // in JWT payload.
      return await UserModel.find(jwtPayload.id)
        .then(resp => {
          return cb(null, resp);
        })
        .catch(err => {
          return cb(err);
        });
    },
  ),
);
