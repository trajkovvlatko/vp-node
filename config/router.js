const createError = require('http-errors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
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

const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'Test API',
      version: '1.0.0',
      description: 'Test Express API with autogenerated swagger doc',
    },
  },
  apis: ['../controllers/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = function (app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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
