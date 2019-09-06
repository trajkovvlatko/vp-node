const passport = require('passport');
require('./passport');
const auth = require('../controllers/auth');
const indexRouter = require('../controllers/index');
const performers = require('../controllers/performers');
const admin_performers = require('../controllers/admin/performers');
const venues = require('../controllers/venues');
const admin_venues = require('../controllers/admin/venues');
const user = require('../controllers/user');

function authenticate() {
  return passport.authenticate('jwt', {session: false});
}

module.exports = function (app) {
  app.use('/', indexRouter);
  app.use('/auth', auth);
  app.use('/performers', performers);
  app.use('/venues', venues);

  // with user
  app.use('/profile', authenticate(), user);
  app.use('/admin/performers', authenticate(), admin_performers);
  app.use('/admin/venues', authenticate(), admin_venues);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });
}
