package ch.webelexis.agenda;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

/**
 * A handler vor requests to the agenda. Since we won't allow random access to
 * the database, we translate external requests to internal messages here.
 * 
 * @author gerry
 * 
 */
public class AgendaHandler implements Handler<Message<JsonObject>> {
	EventBus eb;
	
	AgendaHandler(EventBus eb){
		this.eb=eb;
	}
	/*
	 * this is, what mod_mysql expects { "action" : "prepared", "statement" :
	 * "SELECT * FROM some_test WHERE name=? AND money > ?", "values" :
	 * ["Mr. Test", 15] }
	 * 
	 * and this is, what we expect from the client: { "begin": "yyyymmdd",
	 * "end": "yyyymmdd", "resource": resource, "token": auth-token }
	 */
	@Override
	public void handle(final Message<JsonObject> event) {
		JsonObject request = event.body();
		// TODO authorize
		Server.log.info("received request");
		JsonObject bridge = new JsonObject()
				.putString("action", "prepared")
				.putString(
						"statement",
						"SELECT ID,Tag,PatID,Beginn,Dauer,Grund,TerminTyp,TerminStatus from AGNTERMINE where Tag>=? and Tag <=? and Bereich=? and deleted='0'")
				.putArray(
						"values",
						new JsonArray(new String[] {
								request.getString("begin"),
								request.getString("end"),
								request.getString("resource") }));
				eb.send("ch.webelexis.sql",bridge, new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> returnvalue) {
						JsonObject res=returnvalue.body();
						// TODO remove unneeded fields
						event.reply(res);
					}
				});
	}

}
