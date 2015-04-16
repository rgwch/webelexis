/**
 * This file is part of Webelexis
 * (c) 2015 by G. Weirich 
 */
package ch.webelexis.agenda;

import org.vertx.java.busmods.BusModBase;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;

import ch.webelexis.AuthorizingHandler;

/**
 * The main Verticle of Webelexis-Agenda.
 * 
 * @author gerry
 * 
 */
public class Server extends BusModBase {
	static Logger log;

	@Override
	public void start() {
		// load the configuration as given to 'vertx -conf <config-file>'
		final JsonObject cfg = container.config();
		log = container.logger();
		log.debug("Agenda Server - got config: " + cfg.encodePrettily());
		EventBus eb = vertx.eventBus();
		// final JsonObject aCfg=cfg.getObject("agenda");
		final JsonObject pubCfg = cfg.getObject("public");
		final JsonObject priCfg = cfg.getObject("private");
		final PublicAgendaListHandler publiclistHandler = new PublicAgendaListHandler(this, pubCfg);
		final PublicAgendaInsertHandler publicinsertHandler = new PublicAgendaInsertHandler(this, pubCfg);
		final PrivateAgendaListHandler privateListHandler = new PrivateAgendaListHandler(eb, priCfg);
		final PrivateAgendaInsertHandler privateInsertHandler = new PrivateAgendaInsertHandler(eb, priCfg);

		// Register handlers with the eventBus
		eb.registerHandler("ch.webelexis.publicagenda", new AuthorizingHandler(this, pubCfg.getString("role"),
				new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> msg) {
						String req = msg.body().getString("request");
						log.info("Agenda public Server: received : " + req);
						if (req.equals("list")) {
							publiclistHandler.handle(msg);
						} else if (req.equals("insert")) {
							publicinsertHandler.handle(msg);
						}
					}
				}));
		eb.registerHandler("ch.webelexis.privateagenda", new AuthorizingHandler(this, priCfg.getString("role"),
				new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> msg) {
						String req = msg.body().getString("request");
						log.info("Agenda private Server: received : " + req);
						if (req.equals("list")) {
							privateListHandler.handle(msg);
						} else if (req.equals("insert")) {
							privateInsertHandler.handle(msg);
						} else if (req.equals("resources")) {
							JsonObject result = new JsonObject().putString("status", "ok").putArray("data",
									priCfg.getArray("resources"));
							log.debug("answering: " + result.encodePrettily());
							msg.reply(result);
						}

					}

				}));

	}
}
