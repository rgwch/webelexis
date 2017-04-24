/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/

const VERSION = "2.0.4"

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
//const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nconf = require('nconf');
const cors = require('express-cors')
const compression = require('compression')
const session=require('express-session')
const passport = require('passport')
const uuid = require('uuid/v4')
const args = process.argv.slice(2)
if (args.length > 0) {
  nconf.file(args[0])
} else {
  nconf.file('config.json')
}

console.log("\n" +
  "--------------------------------" +
  "\n Webelexis Janus Server v" + VERSION + "\nCopyright (c) 2017 by G. Weirich\n" +
  "--------------------------------\n\n")
console.log("using " + nconf.get("title"))


const routes = require('./routes/index');
const fhir = require('./routes/fhir');
const auth = require('./routes/auth');


const app = express();

app.VERSION = VERSION
app.use(compression())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view-cache', true);
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '10mb'}));

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  allowedOrigins: [
    'localhost:9000',
    'accounts.google.com'
  ]
}))

//var signature=Math.random().toString()
//app.use(cookieParser(signature));

app.use(session({secret: uuid(), resave: false, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', routes);
app.use('/fhir', fhir);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.disable("x-powered-by")

module.exports = app;
