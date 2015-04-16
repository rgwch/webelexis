/**
 * This file is part of webelexis
 * (c) 2015 by G. Weirich
 */
package ch.webelexis.agenda;

import static ch.webelexis.Cleaner.ELEXISDATE;
import static ch.webelexis.Cleaner.IP;
import static ch.webelexis.Cleaner.TIME;
import static ch.webelexis.Cleaner.UID;

import java.util.Date;
import java.util.UUID;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;

/**
 * Handler for insert operations in the agenda. Listens to messages to
 * "ch.webelexis.agenda.insert"
 * 
 * @author gerry
 */
public class PublicAgendaInsertHandler implements Handler<Message<JsonObject>> {

	EventBus eb;
	JsonObject cfg;
	Logger log;

	public PublicAgendaInsertHandler(Verticle v, JsonObject cfg) {
		this.eb = v.getVertx().eventBus();
		this.cfg = cfg;
		this.log = v.getContainer().logger();
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
		try {
			String day = cl.get("day", ELEXISDATE, false);
			String patid = cl.get("patid", UID, false);
			String[] timeString = cl.get("time", TIME, false).split(":");

			int time = Integer.parseInt(timeString[0]) * 60 + Integer.parseInt(timeString[1]);
			JsonObject bridge = new JsonObject()
					.putString("action", "prepared")
					.putString(
							"statement",
							"INSERT INTO AGNTERMINE (ID,lastupdate,Tag,Bereich,Beginn,Dauer,TerminTyp,TerminStatus,Grund,PatID) VALUES(?,?,?,?,?,?,?,?,?,?)")
					.putArray(
							"values",
							new JsonArray(new String[] { UUID.randomUUID().toString(), Long.toString(new Date().getTime()), day,
									resource, Integer.toString(time), "30", apptType, apptState, cl.get("ip", IP, true), patid }));
			eb.send("ch.webelexis.sql", bridge, new Handler<Message<JsonObject>>() {

				@Override
				public void handle(Message<JsonObject> event) {
					externalEvent.reply(event.body());

				}
			});

		} catch (ParametersException pex) {
			log.error(pex.getMessage(), pex);
			cl.replyError("parameter error");
		}

	}
}