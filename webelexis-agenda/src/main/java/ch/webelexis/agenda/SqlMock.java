package ch.webelexis.agenda;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;

public class SqlMock implements Handler<Message<JsonObject>> {
	String retval="{ status: 'ok', [{'10:00','10:30','uops'},{'10:30','11:00','hach'}]}";
	
	@Override
	public void handle(Message<JsonObject> event) {
		JsonObject ret=new JsonObject(retval);
		event.reply(ret);
	}

}
