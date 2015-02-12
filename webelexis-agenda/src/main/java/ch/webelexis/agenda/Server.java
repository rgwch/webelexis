package ch.webelexis.agenda;

import java.io.File;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.http.HttpServer;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

public class Server extends Verticle {
	static Logger log;
	
	@Override
	public void start(){
		JsonObject cfg=container.config();
		log=container.logger();
		container.deployModule("io.vertx~mod-mongo-persistor~2.1.0", cfg.getObject("mongo"));
		container.deployModule("io.vertx~mod-auth-mgr~2.0.0-final", cfg.getObject("auth"));
		container.deployModule("io.vertx~mod-mysql-postgresql_2.10~0.3.1", cfg.getObject("sql"));
		
		EventBus eb=vertx.eventBus();
		eb.registerHandler("ch.webelexis.agenda.appointments", new AgendaHandler(eb));
		HttpServer httpServer = vertx.createHttpServer();
		JsonObject config = new JsonObject().putString("prefix", "/eventbus");
	

		httpServer.requestHandler(new Handler<HttpServerRequest>() {
		    public void handle(HttpServerRequest req) {
		      String file = "";
		      if (req.path().equals("/")) {
		        file = "index.html";
		      } else if (!req.path().contains("..")) {
		        file = req.path();
		      }
		      File fn = new File("web",file);
		      System.out.println(fn.getAbsolutePath());
		      req.response().sendFile("../web/" + file);
		    }
		});

		JsonArray inOK=cfg.getObject("bridge").getArray("inOK");
		JsonArray outOK=cfg.getObject("bridge").getArray("outOK");
		vertx.createSockJSServer(httpServer).bridge(config, inOK, outOK);

		httpServer.listen(8080);
	}
}
