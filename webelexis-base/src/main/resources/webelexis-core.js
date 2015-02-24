/*************************************
** This file is part of Webelexis   **
** (c) 2015 by G. Weirich           **
**************************************/

var vertx=require('vertx')
var console=require('vertx/console')
var container=require('vertx.container')
var config=container.config
var log=container.logger


var httpServer = vertx.createHttpServer();
var sockJSServer = vertx.createSockJSServer(httpServer);

sockJSServer.bridge({prefix : '/eventbus'}, [], [] );
httpServer.listen(2015);
