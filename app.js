var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var EventRouter = require('./routes/event');
var ticketRouter = require('./routes/ticket');
var registrationRouter = require('./routes/registration');
var venueRouter = require('./routes/venue');
var purchaseRouter = require('./routes/purchase');

var app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Event-Management').then(console.log('Connected')).catch(err => err.message);

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
app.use('/event', EventRouter);
app.use('/category', categoryRouter);
app.use('/ticket', ticketRouter);
app.use('/registration', registrationRouter);
app.use('/venue', venueRouter);
app.use('/purchase', purchaseRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
