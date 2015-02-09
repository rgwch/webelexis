package ch.webelexis.agenda;

import org.vertx.java.core.Handler;
import org.vertx.java.core.http.HttpServer;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

public class Server extends Verticle {

	@Override
	public void start(){
		container.deployVerticle("ch.webelexis.agenda.DBAccess");
		
		HttpServer httpServer = vertx.createHttpServer();
		JsonObject config = new JsonObject().putString("prefix", "/eventbus");
		JsonArray noPermitted = new JsonArray();
		JsonArray inOK=new JsonArray();
		inOK.add(new JsonObject().putString("address", "ch.webelexis.agenda.appointments"));
		noPermitted.add(new JsonObject());


		httpServer.requestHandler(new Handler<HttpServerRequest>() {
		    public void handle(HttpServerRequest req) {
		      String file = "";
		      if (req.path().equals("/")) {
		        file = "index.html";
		      } else if (!req.path().contains("..")) {
		        file = req.path();
		      }
		      req.response().sendFile("web/" + file);
		    }
		});

		vertx.createSockJSServer(httpServer).bridge(config, inOK, noPermitted);

		httpServer.listen(8080);
	}
}
