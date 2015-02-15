package ch.webelexis.agenda;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

public class SqlMock implements Handler<Message<JsonObject>> {
	//String retval="{ 'status': 'ok', [{'10:00','10:30','uops'},{'10:30','11:00','hach'}]}";
	JsonObject retval=new JsonObject().putString("status", "ok");
	JsonArray ja=new JsonArray();
	JsonArray jb=new JsonArray(new String[]{
			"10:00","10:30","test"
	});
	
	@Override
	public void handle(Message<JsonObject> event) {
		retval.putArray("results", jb);
		event.reply(retval);
	}

}
