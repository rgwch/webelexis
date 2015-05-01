/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.InetSocketAddress;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Scanner;
import java.util.TimeZone;
import java.util.UUID;
import java.util.logging.Logger;

import org.vertx.java.core.Handler;
import org.vertx.java.core.MultiMap;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.json.JsonObject;

/**
 * The handler for HTTP requests to the Webelexis server. If root (/) or
 * /index.html is requested, a Session is created, and a custom made File is
 * returned, which contains the SessionID, a unique STATE variable and the
 * Google ClientID of the server (if there is such a ClientID configured). Paths
 * are interpreted relative to the webroot of the Webelexis verticle. Requests
 * to travel the directory tree upwards, are rejected.
 */

public class HTTPHandler implements Handler<HttpServerRequest> {
	File basePath;
	JsonObject cfg;
	EventBus eb;
	// Date: Mon, 27 Apr 2015 16:51:46 GMT
	SimpleDateFormat df = new SimpleDateFormat("E, dd MM yyyy HH:mm:ss z");

	HTTPHandler(JsonObject cfg, EventBus eb) {
		this.cfg = cfg;
		this.eb = eb;
		basePath = new File(cfg.getString("webroot"));
		df.setTimeZone(TimeZone.getTimeZone("UTC"));

	}

	@Override
	public void handle(HttpServerRequest req) {
		Date date = new Date();
		req.response().putHeader("Date", df.format(date));
		req.response().putHeader("Server", "Webelexis");
		if (req.path().equals("/") || req.path().equals("/index.html")) {
			// If the client requests the root file: create a new session.
			String rnd = UUID.randomUUID().toString();
			InetSocketAddress remote = req.remoteAddress();
			String IP = "0.0.0.0";
			if (remote != null) {
				IP = remote.toString();
			}
			JsonObject sessionParams = new JsonObject().putString("clientID", cfg.getString("googleID"))
						.putString("state", rnd).putString("remoteAddress", IP);
			eb.send("ch.webelexis.session.create", sessionParams, new SessionHandler(req, rnd));
		} else if (req.path().contains("..")) {
			// if the client tries to travel up the file system: forbidden
			req.response().setStatusCode(403);
			req.response().end();
		} else {
			File resr = new File(basePath, req.path());
			if (!resr.exists() || !resr.canRead()) {
				req.response().setStatusCode(404); // not found
				req.response().end();
			} else {
				/*
				 * If the client asks for an existing file: define cache control: (arbitrarily). let
				 * css and js be valid for 12 hours, image files for 10 days. But both can
				 * live longer, if the client knows and uses the "if-modified-since"-
				 * Header on expired files.
				 */

				Date lm = new Date(resr.lastModified());
				String reqDat = req.headers().get("if-modified-since");
				boolean noSend = false;
				if (reqDat != null) {
					try {
						Date reqDate = df.parse(reqDat);
						if (!reqDate.before(lm)) { // after or equal
							noSend = true;
						}
					} catch (ParseException e) {
						Logger.getGlobal().warning("could not parse reqDat");
					}
				}
				req.response().putHeader("Last-Modified", df.format(lm));
				if (req.path().endsWith(".css") || req.path().endsWith(".js")) {
					req.response().putHeader("Cache-Control", "max-age=300");
				} else if (req.path().endsWith(".png") || req.path().endsWith(".jpg")) {
					req.response().putHeader("Cache-Control", "public, max-age=864000");
				}
				if (noSend) {
					req.response().setStatusCode(304);
					// req.response().setStatusMessage("not modified");
					req.response().end();
				} else {
					req.response().sendFile(resr.getAbsolutePath());
				}
			}
		}

	}

	/**
	 * Called after a new session is created (the client asked for "/" or "/index.html")
	 * @author gerry
	 *
	 */
	class SessionHandler implements Handler<Message<JsonObject>> {
		HttpServerRequest req;
		String rnd;
		MultiMap headers;
		InetSocketAddress remoteAdress;

		SessionHandler(HttpServerRequest req, String rnd) {
			this.req = req;
			this.rnd = rnd;
			headers = req.headers();
			remoteAdress = req.remoteAddress();
		}

		@Override
		public void handle(Message<JsonObject> msg) {
			File in = new File(cfg.getString("webroot"), "index.html");
			Date lm = new Date(in.lastModified());
			req.response().putHeader("Last-Modified", df.format(lm));
			String cid = cfg.getString("googleID");
			if (cid == null) {
				cid = "x-undefined";
			}
			Scanner scanner = null;
			try {
				scanner = new Scanner(in, "UTF-8");
				String modified = scanner.useDelimiter("\\A").next().replaceAll("GUID",
							msg.body().getString("sessionID")).replaceAll("GOOGLE_CLIENT_ID", cid).replaceAll(
							"GOOGLE_STATE", rnd);

				req.response().end(modified);
			} catch (FileNotFoundException e) {
				req.response().setStatusCode(404);
				req.response().end();
			} finally {
				if (scanner != null) {
					scanner.close();
				}
			}

		}

	}

}
