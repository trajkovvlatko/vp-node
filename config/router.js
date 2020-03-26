const createError = require('http-errors');
const passport = require('passport');
require('./passport');
const auth = require('../app/controllers/auth');
const indexRouter = require('../app/controllers/index');
const performers = require('../app/controllers/performers');
const adminPerformers = require('../app/controllers/admin/performers');
const venues = require('../app/controllers/venues');
const adminVenues = require('../app/controllers/admin/venues');
const users = require('../app/controllers/users');
const search = require('../app/controllers/search');
const genres = require('../app/controllers/genres');
const properties = require('../app/controllers/properties');
const adminBookings = require('../app/controllers/admin/bookings');
const adminNotifications = require('../app/controllers/admin/notifications');

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
  app.use('/admin/performers', authenticate(), adminPerformers);
  app.use('/admin/venues', authenticate(), adminVenues);
  app.use('/admin/bookings', authenticate(), adminBookings);
  app.use('/admin/notifications', authenticate(), adminNotifications);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });
};
