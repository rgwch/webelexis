/**
 * (c) 2015 by G. Weirich 
 */
package ch.webelexis.agenda;

import org.vertx.java.core.eventbus.EventBus;
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

	/**
	 * This method is always the entry point of a Vert.x verticle. The
	 * "container" object exists here (not yet in the constructor!)
	 */
	@Override
	public void start() {
		// load the configuration as given to 'vertx -conf <config-file>'
		JsonObject cfg = container.config();
		log = container.logger();
		EventBus eb = vertx.eventBus();

		// Register handlers with the eventBus
		eb.registerHandler("ch.webelexis.agenda.appointments",
				new AgendaListHandler(eb, cfg.getObject("agenda")));

		eb.registerHandler("ch.webelexis.agenda.insert",
				new AgendaInsertHandler(eb, cfg.getObject("agenda")));

	}
}
