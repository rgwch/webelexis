/**
 * (c) 2015 by G. Weirich 
 */
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

/**
 * The main Verticle of Webelexis-Agenda. Launch necessary modules, create a http- and sockjs- Server, and
 * setup the bridge from sockjs to the vertx eventbus.
 * @author gerry
 *
 */
public class Server extends Verticle {
	static Logger log;
	String rootdir="../web/";

	@Override
	public void start() {
		JsonObject cfg = container.config();
		log = container.logger();
		container.deployModule("io.vertx~mod-mongo-persistor~2.1.0",
				cfg.getObject("mongo"));
		container.deployModule("io.vertx~mod-auth-mgr~2.0.0-final",
				cfg.getObject("auth"));
		container.deployModule("io.vertx~mod-mysql-postgresql_2.10~0.3.1",
				cfg.getObject("sql"));

		EventBus eb = vertx.eventBus();
		eb.registerHandler("ch.webelexis.agenda.appointments",
				new AgendaHandler(eb));
		HttpServer httpServer = vertx.createHttpServer();
		JsonObject config = new JsonObject().putString("prefix", "/eventbus");

		JsonObject bridgeCfg = cfg.getObject("bridge");
		JsonArray inOK = bridgeCfg == null ? new JsonArray() : bridgeCfg
				.getArray("inOK");
		JsonArray outOK = bridgeCfg == null ? new JsonArray() : bridgeCfg
				.getArray("outOK");
				
		if(bridgeCfg!= null && bridgeCfg.getString("webroot") != null){
			rootdir=bridgeCfg.getString("webroot");
		}
		

		httpServer.requestHandler(new Handler<HttpServerRequest>() {
			public void handle(HttpServerRequest req) {
				String file = "";
				if (req.path().equals("/")) {
					file = "index.html";
				} else if (!req.path().contains("..")) {
					file = req.path();
				}
				req.response().sendFile(rootdir + file);
			}
		});
		vertx.createSockJSServer(httpServer).bridge(config, inOK, outOK);

		httpServer.listen(8080);
	}
}
