/**
 * (c) 2015 by G. Weirich 
 */
package ch.webelexis.agenda;

import java.io.File;

import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.http.HttpServer;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

/**
 * The main Verticle of Webelexis-Agenda. Launch necessary modules, create a
 * http- and sockjs- Server, and setup the bridge from sockjs to the vertx
 * eventbus.
 * 
 * @author gerry
 * 
 */
public class Server extends Verticle {
	static Logger log;
	String rootdir = "web";

	/**
	 * This method is always the entry point of a Vert.x verticle. The
	 * "container" object exists here (not yet in the constructor!)
	 */
	@Override
	public void start() {
		// load the configuration as given to 'vertx -conf <config-file>'
		JsonObject cfg = container.config();
		log = container.logger();
		String cfgId = cfg.getString("id");
		System.out
				.println(cfgId == null ? "No 'id' String  found in configuration"
						: "id of this configuration is: " + cfgId);

		EventBus eb = vertx.eventBus();

		// Register handlers with the eventBus
		eb.registerHandler("ch.webelexis.agenda.appointments",
				new AgendaListHandler(eb, cfg.getObject("agenda")));

		eb.registerHandler("ch.webelexis.agenda.insert",
				new AgendaInsertHandler(eb, cfg.getObject("agenda")));

		// find, download and launch the helper modules we need.
		container.deployModule("io.vertx~mod-mongo-persistor~2.1.0",
				cfg.getObject("mongo"), new Handler<AsyncResult<String>>() {

					@Override
					public void handle(AsyncResult<String> event) {
						System.out.println(event.succeeded() ? "Mongo ok"
								: "Mongo failed");
					}
				});
		container.deployModule("io.vertx~mod-auth-mgr~2.0.0-final",
				cfg.getObject("auth"), new Handler<AsyncResult<String>>() {

					@Override
					public void handle(AsyncResult<String> event) {
						System.out.println(event.succeeded() ? "AuthMgr ok"
								: "AuthMgr failed");
					}
				});
		if ((cfg.getObject("sql") != null)
				&& (!cfg.getObject("sql").getString("connection")
						.equals("mock"))) {
			container.deployModule("io.vertx~mod-mysql-postgresql_2.10~0.3.1",
					cfg.getObject("sql"), new Handler<AsyncResult<String>>() {

						@Override
						public void handle(AsyncResult<String> event) {
							System.out.println(event.succeeded() ? "SQL ok"
									: "SQL failed");
						}
					});
		} else {
			eb.registerHandler("ch.webelexis.sql", new SqlMock());
			System.out.println("Mock Handler installed");
		}

		// Create a web server
		HttpServer httpServer = vertx.createHttpServer();
		JsonObject config = new JsonObject().putString("prefix", "/eventbus");

		// configure the "firewall":define, which messages are allowed to pass
		JsonObject bridgeCfg = cfg.getObject("bridge");
		if (bridgeCfg == null) {
			bridgeCfg = new JsonObject();
		}
		JsonArray inOK = bridgeCfg.containsField("inOK") ? bridgeCfg
				.getArray("inOK") : new JsonArray();
		JsonArray outOK = bridgeCfg.containsField("outOK") ? bridgeCfg
				.getArray("outOK") : new JsonArray();

		if (bridgeCfg != null && bridgeCfg.getString("webroot") != null) {
			rootdir = bridgeCfg.getString("webroot");
		}

		// Handler for all http requests: make sure files are delivered relative
		// to the
		// webroot directory (and discard requests containing any "..")
		httpServer.requestHandler(new Handler<HttpServerRequest>() {
			public void handle(HttpServerRequest req) {
				String file = "";
				if (req.path().equals("/")) {
					file = "index.html";
				} else if (!req.path().contains("..")) {
					file = req.path();
				}
				File ans = new File(rootdir, file);
				// System.out.println(ans.getAbsolutePath());
				req.response().sendFile(ans.getAbsolutePath());
			}
		});
		// create the websocket
		vertx.createSockJSServer(httpServer).bridge(config, inOK, outOK);

		httpServer.listen(bridgeCfg.getInteger("port") == null ? 2015
				: bridgeCfg.getInteger("port"));
	}
}
