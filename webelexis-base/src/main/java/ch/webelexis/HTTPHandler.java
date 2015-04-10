package ch.webelexis;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.UUID;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.json.JsonObject;

public class HTTPHandler implements Handler<HttpServerRequest> {
	File basePath;
	JsonObject cfg;
	EventBus eb;

	HTTPHandler(JsonObject cfg, EventBus eb) {
		this.cfg = cfg;
		this.eb = eb;
		basePath = new File(cfg.getString("webroot"));
	}

	@Override
	public void handle(HttpServerRequest req) {

		if (req.path().equals("/") || req.path().equals("/index.html")) {
			String rnd = UUID.randomUUID().toString();
			JsonObject sessionParams = new JsonObject().putString("clientID", cfg.getString("googleID")).putString(
					"state", rnd);
			eb.send("ch.webelexis.session.create", sessionParams, new SessionHandler(req, rnd));
		} else if (req.path().contains("..")) {
			req.response().setStatusCode(404);
			req.response().end();
		} else {
			req.response().sendFile(new File(basePath, req.path()).getAbsolutePath());
		}

	}

	class SessionHandler implements Handler<Message<JsonObject>> {
		HttpServerRequest req;
		String rnd;

		SessionHandler(HttpServerRequest req, String rnd) {
			this.req = req;
			this.rnd = rnd;
		}

		@Override
		public void handle(Message<JsonObject> msg) {
			File in = new File(cfg.getString("webroot"), "index.html");
			String cid = cfg.getString("googleID");
			if (cid == null) {
				cid = "x-undefined";
			}
			Scanner scanner = null;
			try {
				scanner = new Scanner(in, "UTF-8");
				String modified = scanner.useDelimiter("\\A").next()
						.replaceAll("GUID", msg.body().getString("sessionID")).replaceAll("GOOGLE_CLIENT_ID", cid)
						.replaceAll("GOOGLE_STATE", rnd);

				req.response().end(modified);
			} catch (FileNotFoundException e) {
				req.response().setStatusCode(404);
				req.response().end();
			} finally {
				scanner.close();
			}

		}

	}

}
