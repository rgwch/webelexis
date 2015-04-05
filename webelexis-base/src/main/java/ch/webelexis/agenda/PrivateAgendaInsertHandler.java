package ch.webelexis.agenda;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;

public class PrivateAgendaInsertHandler implements Handler<Message<JsonObject>> {
	EventBus eb;
	JsonObject cfg;
	Logger log=Server.log;

		public PrivateAgendaInsertHandler(EventBus eb, JsonObject cfg) {
				this.eb=eb;
				this.cfg=cfg;
		}

	@Override
	public void handle(Message<JsonObject> arg0) {
		// TODO Auto-generated method stub
		
	}

}
