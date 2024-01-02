if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
});
const passport = require("passport");
const initializePassport = require("./config/passport.config");
initializePassport(passport);
const session = require("express-session");
const flash = require("express-flash")

const indexRouter = require('./routes/index');
const projectRouter = require('./routes/project');
const webControlRouter = require('./routes/web_control_routes');
const usersRouter = require('./routes/users');
const dashboardRouter = require('./routes/dashboard');
const superAdminRouter = require('./routes/super_admin');
const adminRouter = require('./routes/admin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(limiter);
app.use(cors({
  origin: "http://localhost:3000/"
}));
app.use(session({
  // cookie: {ephemeral: true},
  // cookieName: "session",
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/redirect', webControlRouter);
app.use('/dashboard', dashboardRouter);
app.use('/project', projectRouter);
app.use('/admin', adminRouter);
app.use('/61261301/super-admin', superAdminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.server_mode = true
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
