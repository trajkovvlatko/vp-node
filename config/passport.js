const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const secret = process.env.JWT_SECRET;
const {User} = require('../app/models');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },

    async function (email, password, cb) {
      try {
        const resp = await User.findByCredentials(email, password);
        if (!resp || resp.error) {
          return cb(null, false, {message: 'Incorrect email or password.'});
        }
        return cb(null, resp, {message: 'Logged In Successfully'});
      } catch (err) {
        return cb(err);
      }
    },
  ),
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    },
    async function (jwtPayload, cb) {
      // find the user in db if needed.
      // This functionality may be omitted if you store everything you'll need
      // in JWT payload.
      return await User.findByPk(jwtPayload.id, {
        attributes: ['id', 'name', 'email'],
      })
        .then(async (resp) => {
          return await cb(null, resp);
        })
        .catch((err) => {
          return cb(err);
        });
    },
  ),
);
