package ch.webelexis.agenda;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

public class SqlMock implements Handler<Message<JsonObject>> {
	//String retval="{ 'status': 'ok', [{'10:00','10:30','uops'},{'10:30','11:00','hach'}]}";
	JsonObject retval=new JsonObject().putString("status", "ok");
	
	@Override
	public void handle(Message<JsonObject> event) {
		JsonArray ja=new JsonArray();
		JsonArray jb=new JsonArray(new String[]{
				
				"20150213","600","30","123456afjfdhssdg","Müller","Fritz","Normal","geplant","Schmerz da und dort"
		});
		JsonArray jc=new JsonArray(new String[]{
				"20150213","660","45","12ff56afefdhaadc","Meier","Anna","Normal","geplant","Schnupfen"
				
		});
		

		ja.add(jb);
		ja.add(jc);
		retval.putArray("results", ja);
		
		event.reply(retval);
	}

}
