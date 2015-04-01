package ch.webelexis;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.UUID;

import org.vertx.java.core.Handler;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.json.JsonObject;

public class HTTPHandler implements Handler<HttpServerRequest> {
	JsonObject cfg;

	HTTPHandler(JsonObject cfg) {
		this.cfg = cfg;
	}

	@Override
	public void handle(HttpServerRequest req) {
		File basePath = new File(cfg.getString("webroot"));
		if (req.path().equals("/") || req.path().equals("/index.html")) {

			File in = new File(cfg.getString("webroot"), "index.html");
			String cid = cfg.getString("googleID");
			if (cid == null) {
				req.response().sendFile(
						basePath.getAbsolutePath() + "/index.html");
			} else {
				Scanner scanner = null;
				try {
					String rnd = UUID.randomUUID().toString();
					scanner = new Scanner(in, "UTF-8");
					String modified = scanner.useDelimiter("\\A").next()
							.replaceAll("GOOGLE_CLIENT_ID", cid)
							.replaceAll("GOOGLE_STATE", rnd);
					scanner.close();
					// req.response().write(modified);
					req.response().end(modified);
				} catch (FileNotFoundException e) {
					req.response().setStatusCode(404);
					req.response().end();
				}
			}
		} else if (req.path().contains("..")) {
			req.response().setStatusCode(404);
			req.response().end();
		} else {
			req.response().sendFile(
					new File(basePath, req.path()).getAbsolutePath());
		}

	}

}
