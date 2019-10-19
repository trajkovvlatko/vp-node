const createError = require('http-errors');
const passport = require('passport');
require('./passport');
const auth = require('../app/controllers/auth');
const indexRouter = require('../app/controllers/index');
const performers = require('../app/controllers/performers');
const admin_performers = require('../app/controllers/admin/performers');
const venues = require('../app/controllers/venues');
const admin_venues = require('../app/controllers/admin/venues');
const users = require('../app/controllers/users');
const search = require('../app/controllers/search');
const genres = require('../app/controllers/genres');

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

  // with user
  app.use('/profile', authenticate(), users);
  app.use('/admin/performers', authenticate(), admin_performers);
  app.use('/admin/venues', authenticate(), admin_venues);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });
}
