const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');
const logger = require('morgan');
const cors = require('cors');

const app = express();
app.set('port', process.env.PORT || 4000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

require('./config/router')(app);

// error handler
app.use(function (err, req, res) {
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
