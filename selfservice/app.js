/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2019 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

const io=require('socket.io-client')
const feathers=require('@feathersjs/feathers')
const socketio=require('@feathersjs/socketio-client')
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const indexRouter = require('./routes/index');
const terminRouter=require("./routes/schedule")

const app = express();
const port=3030

const socket=io(`http://localhost:${port}`)
// const socket=io("http://192.168.0.1:2019")
const client=feathers()
client.configure(socketio(socket))
const terminService=client.service('schedule')
app.set("terminService",terminService)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res)=>{
  res.redirect(302, "/termin/list")
});
app.get("/datenschutz",(req,res)=>{
  terminService.get("site").then(sitedef=>{
    res.render('datenschutz',{
      sitedef
    })
  })
})

app.use("/termin",terminRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{error: new Error(err), message:"Interner Fehler"});
});

module.exports = app;
