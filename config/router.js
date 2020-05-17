const createError = require('http-errors');
const passport = require('passport');
require('./passport');
const auth = require('../app/controllers/auth_controller');
const indexRouter = require('../app/controllers/index_controller');
const performers = require('../app/controllers/performers_controller');
const userPerformers = require('../app/controllers/user/performers_controller');
const venues = require('../app/controllers/venues_controller');
const userVenues = require('../app/controllers/user/venues_controller');
const users = require('../app/controllers/users_controller');
const search = require('../app/controllers/search_controller');
const genres = require('../app/controllers/genres_controller');
const properties = require('../app/controllers/properties_controller');
const userBookings = require('../app/controllers/user/bookings_controller');

function authenticate() {
  return passport.authenticate('jwt', {session: false});
}

module.exports = function (app) {
  app.use('/', indexRouter);
  app.use('/auth', auth);
  app.use('/performers', performers);
  app.use('/venues', venues);
  app.use('/search', search);
  app.use('/genres', genres);
  app.use('/properties', properties);

  // with user
  app.use('/user/profile', authenticate(), users);
  app.use('/user/performers', authenticate(), userPerformers);
  app.use('/user/venues', authenticate(), userVenues);
  app.use('/user/bookings', authenticate(), userBookings);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });
};
