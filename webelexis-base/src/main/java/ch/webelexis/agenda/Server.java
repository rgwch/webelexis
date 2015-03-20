/**
 * This file is part of Webelexis
 * (c) 2015 by G. Weirich 
 */
package ch.webelexis.agenda;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

/**
 * The main Verticle of Webelexis-Agenda. 
 * @author gerry
 * 
 */
public class Server extends Verticle {
	static Logger log;

	@Override
	public void start() {
		// load the configuration as given to 'vertx -conf <config-file>'
		JsonObject cfg = container.config();
		log = container.logger();
		EventBus eb = vertx.eventBus();
		final AgendaListHandler listHandler=new AgendaListHandler(eb, cfg.getObject("agenda"));
		final AgendaInsertHandler insertHandler=new AgendaInsertHandler(eb, cfg.getObject("agenda"));


		// Register handlers with the eventBus
		eb.registerHandler("ch.webelexis.agenda",
				new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> msg) {
						String req=msg.body().getString("request");
						if(req.equals("list")){
							listHandler.handle(msg);
						}else if(req.equals("insert")){
							insertHandler.handle(msg);
						}
				
					}
				});
				
	}
}
