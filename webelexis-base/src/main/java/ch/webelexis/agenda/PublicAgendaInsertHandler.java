/**
 * This file is part of webelexis
 * (c) 2015 by G. Weirich
 */
package ch.webelexis.agenda;

import java.util.Date;
import java.util.UUID;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

import ch.webelexis.Cleaner;
import static ch.webelexis.Cleaner.*;

/**
 * Handler for insert operations in the agenda. Listens to messages to
 * "ch.webelexis.agenda.insert"
 * 
 * @author gerry
 */
public class PublicAgendaInsertHandler implements Handler<Message<JsonObject>> {

	EventBus eb;
	JsonObject cfg;

	PublicAgendaInsertHandler(EventBus eb, JsonObject cfg) {
		this.eb = eb;
		this.cfg = cfg;
	}

	/**
	 * expected parameter is a Json Object: { day: 'yyyymmdd', time: 'hh:mm',
	 * name: 'name, firstname, DOB', ip: 'ip-address'}
	 */
	@Override
	public void handle(final Message<JsonObject> externalEvent) {
		Cleaner cl = new Cleaner(externalEvent);
		String apptType = cfg.getString("apptType");
		if (apptType == null) {
			apptType = "Normal";
		}
		String apptState = cfg.getString("apptState");
		if (apptState == null) {
			apptState = "Via Internet";
		}
		String resource = cfg.getString("resource");
		if (resource == null) {
			resource = "default";
		}
		String day = cl.get("day", DATE);
		String name = cl.get("name", NOTEMPTY);
		String[] timeString = cl.get("time", TIME).split(":");
		if (day.length() > 0 && name.length() > 0 && timeString.length == 2) {
			int time = Integer.parseInt(timeString[0]) * 60 + Integer.parseInt(timeString[1]);
			JsonObject bridge = new JsonObject()
					.putString("action", "prepared")
					.putString(
							"statement",
							"INSERT INTO AGNTERMINE (ID,lastupdate,Tag,Bereich,Beginn,Dauer,TerminTyp,TerminStatus,Grund,PatID) VALUES(?,?,?,?,?,?,?,?,?,?)")
					.putArray(
							"values",
							new JsonArray(new String[] { UUID.randomUUID().toString(), Long.toString(new Date().getTime()), day,
									resource, Integer.toString(time), "30", apptType, apptState, cl.get("ip", IP), name }));
			eb.send("ch.webelexis.sql", bridge, new Handler<Message<JsonObject>>() {

				@Override
				public void handle(Message<JsonObject> event) {
					externalEvent.reply(event.body());

				}
			});

		} else {
			System.out.println(externalEvent.body().toString());
			externalEvent.reply(new JsonObject().putString("status", "error").putString("message", "syntax error"));
		}
	}
}