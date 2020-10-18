require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const auth = require('./middlewares/auth')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const positionsRouter = require('./routes/positions');
const authRouter = require('./routes/auth');
require('./config/passport')

const db = require('./database/db')
db.connectToDatabase(process.env.DB_URL)

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/positions', auth.isAuthenticated(), positionsRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if(err.status == 401) {
    res.redirect('/auth/login')
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
