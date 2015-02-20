package ch.webelexis.agenda;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

public class AgendaInsertHandler implements Handler<Message<JsonObject>> {
	static final String DATE = "20[0-9]{6,6}";
	static final String TIME = "[0-2][0-9]:[0-5][0-9]";
	static final String TEXT = "[A_Za-z \\.]";
	EventBus eb;
	JsonObject cfg;

	AgendaInsertHandler(EventBus eb, JsonObject cfg) {
		this.eb = eb;
		this.cfg = cfg;
	}

	@Override
	public void handle(final Message<JsonObject> externalEvent) {
		Cleaner cl = new Cleaner(externalEvent.body());
		JsonObject bridge = new JsonObject()
				.putString("action", "prepared")
				.putString(
						"statement",
						"INSERT INTO AGNTERMINE (Tag,Bereich,Beginn,Dauer,TerminTyp,TerminStatus,Grund,PatID) VALUES(?,?,?,?,?,?,?,?)")
				.putArray(
						"values",
						new JsonArray(new String[] { cl.get("day", DATE),
								cl.get("resource", TEXT), cl.get("time", TIME),
								"30", "internet", "geplant", "",
								cl.get("name", TEXT) }));
		eb.send("ch.webelexis.sql", bridge, new Handler<Message<JsonObject>>() {

			@Override
			public void handle(Message<JsonObject> event) {
				externalEvent.reply(event);
				
			}
		});
	}
}