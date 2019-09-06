const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');
const logger = require('morgan');
const passport = require('passport');
const auth = require('./controllers/auth');
const user = require('./controllers/user');
const performers = require('./controllers/performers');
const admin_performers = require('./controllers/admin/performers');
require('./lib/passport');

const indexRouter = require('./controllers/index');

function authenticate() {
  return passport.authenticate('jwt', {session: false});
}

const app = express();
app.set('port', process.env.PORT || 4000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', auth);
app.use('/performers', performers);

// with user
app.use('/user', authenticate(), user);
app.use('/admin/performers', authenticate(), admin_performers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  console.log(res.locals.error);

  // render the error page
  res.status(err.status || 500);
  res.send({error: true});
});

module.exports = app;
