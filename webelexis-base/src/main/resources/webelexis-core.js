/*************************************
 ** This file is part of Webelexis   **
 ** (c) 2015 by G. Weirich           **
 **************************************/

/*
This is the server-side core module for webelexis. It creates a HTTP Server and a Sockjs-Server as primary entry points for
all subprojects.
To connect, a subproject must simply define an address on the EventBus and listen to that address. If access from outside is required, that address must be registered in the config file (section bridge/inOK)

Launch webelexis with 'vertx run webelexis-core.js -config <yourconfig.json>
*/

var vertx = require('vertx')
var console = require('vertx/console')
var container = require('vertx/container')
var config = container.config
var log = container.logger

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
container.deployModule("io.vertx~mod-mysql-postgresql_2.10~0.3.1", config.sql, function (err, id) {
    if (err) {
        log.fatal("could not launch sql connector " + err.getMessage());
    } else {
        log.info("sql connector launched with id: " + id);
    }
});

if (config.mongo === undefined) {
    config.mongo = {
        "address": "ch.webelexis.nosql",
        "db_name": "webelexis"
    }
}
container.deployModule("io.vertx~mod-mongo-persistor~2.1.0", config.mongo, function (err, id) {
    if (err) {
        log.fatal("could not launch mongo connector " + err.getMessage());
    } else {
        log.info("mongo connector launched with id: " + id);
    }
});

if (config.auth === undefined) {
    config.auth = {
        "address": "ch.webelexis.auth",
        "user_collection": "users",
        "persistor_address": "ch.webelexis.nosql",
    }
}
container.deployModule("io.vertx~mod-auth-mgr~2.0.0-final", config.auth, function (err, id) {
    if (err) {
        log.fatal("could not launch authenticate module " + err.getMessage());
    } else {
        log.info("authenticator module launched with id: " + id);
    }

});

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
                "address": "ch.webelexis.agenda.appointments"
                },
            {
                "address": "ch.webelexis.agenda.insert"
                }
            ],
        "outOK": []
    }
}
var httpServer = vertx.createHttpServer();
httpServer.requestHandler(function(request) {
    log.info("got request: " + request.method()+" "+request.path())
    if (request.path() == "/") {
        request.response.sendFile(config.bridge.webroot+"/index.html");
        console.log(config.bridge.webroot+"/index.html")
    } else if (request.path().indexOf("..") != -1) {
        request.response.statusCode(404)
        request.response.end();
    } else {
        console.log(config.bridge.webroot+"/"+request.path())
        request.response.sendFile(config.bridge.webroot + "/" + request.path());
    }
});
var sockJSServer = vertx.createSockJSServer(httpServer);
sockJSServer.bridge({
    prefix: '/eventbus'
}, config.bridge.inOK, config.bridge.outOK);
httpServer.listen(config.bridge.port);