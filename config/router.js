const createError = require('http-errors');
const passport = require('passport');
require('./passport');
const auth = require('../app/controllers/auth');
const indexRouter = require('../app/controllers/index');
const performers = require('../app/controllers/performers');
const userPerformers = require('../app/controllers/user/performers');
const venues = require('../app/controllers/venues');
const userVenues = require('../app/controllers/user/venues');
const users = require('../app/controllers/users');
const search = require('../app/controllers/search');
const genres = require('../app/controllers/genres');
const properties = require('../app/controllers/properties');
const userBookings = require('../app/controllers/user/bookings');
const userNotifications = require('../app/controllers/user/notifications');

function authenticate() {
  return passport.authenticate('jwt', {session: false});
}

module.exports = function(app) {
  app.use('/', indexRouter);
  app.use('/auth', auth);
  app.use('/performers', performers);
  app.use('/venues', venues);
  app.use('/search', search);
  app.use('/genres', genres);
  app.use('/properties', properties);

  // with user
  app.use('/profile', authenticate(), users);
  app.use('/user/performers', authenticate(), userPerformers);
  app.use('/user/venues', authenticate(), userVenues);
  app.use('/user/bookings', authenticate(), userBookings);
  app.use('/user/notifications', authenticate(), userNotifications);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });
};
