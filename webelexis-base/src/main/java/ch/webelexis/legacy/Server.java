/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.legacy;

import java.io.InputStream;

import org.vertx.java.busmods.BusModBase;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;

/**
 * Verticle to fetch legacy Elexis's PersistentObjects into Webelexis. message
 * to "ch.webelexis.elexis-link: { op:"fetch", type: "kontakt", uid:
 * "abs9f-cde08-a1" }
 * 
 * returns: { status:"ok", result: <json object> } or { status: "error",
 * message: <message> }
 * 
 * @author gerry
 *
 */
public class Server extends BusModBase {
	Logger log;
	JsonObject cfg;
	EventBus eb;
	JsonObject mapping;

	@Override
	public void start() {
		log = container.logger();
		cfg = container.config();
		eb = vertx.eventBus();
		InputStream in = getClass().getResourceAsStream("/mapping.json");
		if (in == null) {
			log.error("Mapping file not found");
			throw new RuntimeException("mapping not found");
		}
		try {
			mapping = Cleaner.createFromStream(in);
		} catch (Exception e) {
			e.printStackTrace();
			log.fatal("decode error: mapping json");
			throw new RuntimeException("invalid mapping json");
		}
		log.info("Legacy Server started. got config " + cfg.encodePrettily());
		eb.registerHandler("ch.webelexis.elexis-link", new Handler<Message<JsonObject>>() {

			@Override
			public void handle(Message<JsonObject> externalRequest) {
				Cleaner cl = new Cleaner(externalRequest);
				try {
					String op = cl.get("op", Cleaner.WORD, false);
					String type = cl.get("type", Cleaner.WORD, false);
					String uid = cl.get("id", Cleaner.UID, false);
					if (op.equalsIgnoreCase("fetch")) {
						JsonObject def = mapping.getObject(type);
						if (def == null) {
							cl.replyError("unknown type " + type);
						} else {
							PersistentObject po = new PersistentObject(def, uid);
							po.fetchAsync(eb, cl);
						}
					} else {
						cl.replyError("illegal op " + op);
					}
				} catch (ParametersException pex) {
					cl.replyError("Parameter error");
				}

			}
		});
	}
}
