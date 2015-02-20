var vertx=require('vertx')
var container=require('vertx/container')
var console=require('vertx/console')


var config=container.config
console.log("got config: "+config.id)

var result=function(name, err,deployID){
	if(err){
		console.log(name+" failed. Message: "+err.getMessage())
	}else{
		console.log(name+" success, ID is "+deployID)
	}
}

container.deployModule("io.vertx~mod-mysql-postgresql_2.10~0.3.1",config.sql, function(err,id){result("sql", err,id)})
container.deployModule("io.vertx~mod-mongo-persistor~2.1.0",config.mongo,function(err,id){result("mongo",err,id)});
container.deployModule("io.vertx~mod-auth-mgr~2.0.0-final",config.auth, function(err,id){result("auth. mgr.",err,id)})
console.log("Webelexis Agenda Server:")
container.deployVerticle("ch.webelexis.agenda.Server",config.bridge)		


		
		
