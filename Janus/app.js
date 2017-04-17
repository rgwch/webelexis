/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/

const VERSION="2.0.5
"

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nconf=require('nconf');
var cors = require('express-cors')
var compression = require('compression')
var args=process.argv.slice(2)
if(args.length>0) {
  nconf.file(args[0])
}else{
  nconf.file('config.json')
}

console.log("\n" +
  "--------------------------------" +
  "\n Webelexis Janus Server v"+VERSION+"\nCopyright (c) 2017 by G. Weirich\n"+
  "--------------------------------\n\n")
console.log("using "+nconf.get("title"))

var routes = require('./routes/index');
var fhir = require('./routes/fhir');


var app = express();
app.VERSION=VERSION
app.use(compression())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit:'10mb' }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  allowedOrigins:[
      'localhost:9000'
  ]
}))

app.use('/', routes);
app.use('/fhir', fhir);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.disable("x-powered-by")

module.exports = app;
