/***** DEPRECATED. DONT USE *********/

/*******************************************************************************
 * * This file is part of Webelexis ** * (c) 2015 by G. Weirich **
 ******************************************************************************/

/*
 * This is the server-side core module for webelexis. It creates a HTTP Server
 * and a Sockjs-Server as primary entry points for all subprojects. To connect,
 * a subproject must simply define an address on the EventBus and listen to that
 * address. If access from outside is required, that address must be registered
 * in the config file (section bridge/inOK)
 * 
 * Launch webelexis with 'vertx run webelexis-core.js -config <yourconfig.json>
 */

var vertx = require('vertx')
var console = require('vertx/console')
var container = require('vertx/container')
var config = container.config
var log = container.logger

// utility function for module launching
var deploystate= function (name, err,id){
	if(err){
        log.fatal(name+": could not launch; " + err.getMessage());
	}else{
	      log.info(name+" connector launched successfully with id: " + id);
	      
	}
}

// provide a default config if none ws supplied
if (config === undefined) {
    log.info("config is not defined")
    config = {
        "id": "Default configuration from Webelexis-base"
    }
}

if (config.sql === undefined) {
    log.info("config.sql is not defined")
    config.sql = {
        "address": "ch.webelexis.sql",
        "connection": "MySQL",
        "host": "localhost",
        "port": 3306,
        "username": "elexisuser",
        "password": "elexis",
        "database": "elexis"
    }
}

container.deployModule("io.vertx~mod-mysql-postgresql_2.10~0.3.1", config.sql, function(err,id){ deploystate("sql",err,id)})

if (config.mongo === undefined) {
    config.mongo = {
        "address": "ch.webelexis.nosql",
        "db_name": "webelexis"
    }
}
container.deployModule("io.vertx~mod-mongo-persistor~2.1.0", config.mongo, function (err, id) {deploystate("mongo-persistor", err, id)})

if (config.auth === undefined) {
    config.auth = {
        "address": "ch.webelexis.auth",
        "user_collection": "users",
        "persistor_address": "ch.webelexis.nosql",
    }
}
container.deployVerticle("ch.rgw.vertx.AuthManager", config.auth, function (err, id) {deploystate("Authentication manager", err, id)})

container.deployVerticle("ch.webelexis.agenda.Server", config, function (err, id){ deploystate("Agenda Server", err, id)}) 

if (config.bridge === undefined) {
    config.bridge = {
        "webroot": "web",
        "port": 2015,
        "inOK": [
            {
                "address": "ch.webelexis.auth.login"
                },
            {
                "address": "ch.webelexis.auth.logout"
                },
            {
                "address": "ch.webelexis.agenda"
                }
            ],
        "outOK": []
    }
}
var httpServer = vertx.createHttpServer();
httpServer.requestHandler(function(request) {
    log.info("got request: " + request.method()+" "+request.path())
    if (request.path() === "/") {
        request.response.sendFile(config.bridge.webroot+"/index.html");
        // console.log(config.bridge.webroot+"/index.html")
    } else if (request.path().indexOf("..") !== -1) {
        request.response.statusCode(404)
        request.response.end();
    } else {
        // console.log(config.bridge.webroot+request.path())
        request.response.sendFile(config.bridge.webroot+request.path());
    }
});
var sockJSServer = vertx.createSockJSServer(httpServer);
sockJSServer.bridge({
    prefix: '/eventbus'
}, config.bridge.inOK, config.bridge.outOK);
httpServer.listen(config.bridge.port);