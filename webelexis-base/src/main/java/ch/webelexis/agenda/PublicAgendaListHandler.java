/**
 * This file is part of Webelexis
 * (c) 2015 by G. Weirich
 */

package ch.webelexis.agenda;

import static ch.webelexis.Cleaner.ELEXISDATE;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.TreeSet;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.json.impl.Json;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;

/**
 * A handler for list requests to the agenda. Since we won't allow random access
 * to the database, we translate external requests to internal messages here.
 * 
 * @author gerry
 * 
 */
public class PublicAgendaListHandler implements Handler<Message<JsonObject>> {
	EventBus eb;
	static final int FLD_DAY = 0;
	static final int FLD_BEGIN = 1;
	static final int FLD_DURATION = 2;
	static final int FLD_TYPE = 3;
	static final int FLD_PATIENT_ID=4;
	Logger log;
	JsonObject cfg;

	public PublicAgendaListHandler(Verticle v, JsonObject cfg) {
		this.eb = v.getVertx().eventBus();
		this.log=v.getContainer().logger();
		this.cfg = cfg;
	}

	/*
	 * this is, what mod_mysql expects { "action" : "prepared", "statement" :
	 * "SELECT * FROM some_test WHERE name=? AND money > ?", "values" :
	 * ["Mr. Test", 15] }
	 * 
	 * and this is, what we expect from the client: { "begin": "yyyymmdd", "end":
	 * "yyyymmdd", "token": auth-token }
	 */
	@Override
	public void handle(final Message<JsonObject> externalRequest) {
		Cleaner cl = new Cleaner(externalRequest);
		log.debug("public agenda handler "+externalRequest.body().encodePrettily());
		
		final String resource = cfg.getString("resource") == null ? "" : cfg.getString("resource");
		try {
			JsonObject bridge = new JsonObject()
					.putString("action", "prepared")
					.putString("statement",
							"SELECT Tag,Beginn,Dauer, TerminTyp, PatID from AGNTERMINE where Tag>=? and Tag <=? and Bereich=? and deleted='0'")
					.putArray(
							"values",
							new JsonArray(new String[] { cl.get("begin", ELEXISDATE, false), cl.get("begin", ELEXISDATE, false),
									resource }));
			log.debug("sending message: " + bridge.encodePrettily());
			eb.send("ch.webelexis.sql", bridge, new Handler<Message<JsonObject>>() {

				@Override
				public void handle(Message<JsonObject> returnvalue) {
					JsonObject res = returnvalue.body();
					if (res.getString("status").equals("ok")) {

						externalRequest.reply(fillBlanks(res.getArray("results").toArray(),externalRequest.body().getObject("authorized_user")));

					} else {
						System.out.println(Json.encodePrettily(res));
						externalRequest.reply(new JsonObject().putString("status", "failure"));
					}
				}
			});
		} catch (ParametersException pex) {
			log.error(pex.getMessage(), pex);
			cl.replyError("parameter error");
		}
	}

	/*
	 * fill empty periods of time with "free" appointments
	 * 
	 * @param set
	 */
	private JsonObject fillBlanks(Object[] appointments, JsonObject user) {
		TreeSet<JsonArray> orderedList = new TreeSet<JsonArray>(new Comparator<JsonArray>() {
			@Override
			public int compare(JsonArray o1, JsonArray o2) {
				String day1 = o1.get(FLD_DAY);
				String day2 = o2.get(FLD_DAY);
				if (day1.equals(day2)) {
					int start1 = Integer.parseInt(((String) o1.get(FLD_BEGIN)).trim());
					int start2 = Integer.parseInt(((String) o2.get(FLD_BEGIN)).trim());
					return start1 - start2;
				}
				return day1.compareTo(day2);
			}
		});
		
		String userid="-";
		if(user!=null){
			userid=user.getString("patientid","-");
		}
		log.debug("user id:"+userid);
		for (Object li : appointments) {
			@SuppressWarnings("unchecked")
			List<Object> line = (ArrayList<Object>) li;
			orderedList.add(new JsonArray(line));
		}
	
		int endTime = 0;
		Iterator<JsonArray> lines = orderedList.iterator();
		JsonArray arr = new JsonArray();
		int slot = 30;
		if (cfg != null) {
			slot = cfg.getInteger("timeSlot") == null ? 30 : cfg.getInteger("timeSlot");

		}

		// Fill in "available" spaces between appointments. Avalailables have
		// the length "slot" as defined in the config
		while (lines.hasNext()) {
			JsonArray aNext = (JsonArray) lines.next();
			int startTime = Integer.parseInt(((String) aNext.get(FLD_BEGIN)).trim());
			while ((startTime - endTime) >= slot) {
				String[] free = new String[aNext.size()];
				free[FLD_DAY] = aNext.get(FLD_DAY);
				free[FLD_BEGIN] = Integer.toString(endTime);
				free[FLD_DURATION] = Integer.toString(slot); // slotInteger.toString(startTime
				// - endTime);
				free[FLD_TYPE] = "available";
				arr.addArray(new JsonArray(free));
				endTime += slot;
				// System.out.println("created "+free[FLD_BEGIN]+","+free[FLD_DURATION]);
			}
			if ((startTime - endTime) > 0) {
				String[] shorttime = new String[aNext.size()];
				shorttime[FLD_DAY] = aNext.get(FLD_DAY);
				shorttime[FLD_BEGIN] = Integer.toString(endTime);
				shorttime[FLD_DURATION] = Integer.toString(startTime - endTime);
				shorttime[FLD_TYPE] = "occupied";
				// System.out.println("rest "+free[FLD_BEGIN]+","+free[FLD_DURATION]);
				arr.addArray(new JsonArray(shorttime));
			}
			endTime = startTime + Integer.parseInt(((String) aNext.get(FLD_DURATION)).trim());
			Object[] line = aNext.toArray();
			if ((line[FLD_PATIENT_ID] != null) && (line[FLD_PATIENT_ID].equals(userid))) {
				line[FLD_PATIENT_ID] = "Ihr Termin: " + user.getString("username");
				line[FLD_TYPE] = "user";
			} else {
				line[FLD_PATIENT_ID] = "";
				line[FLD_TYPE]="occupied";
			}
			arr.addArray(new JsonArray(line));
		}

		JsonObject ores = new JsonObject().putString("status", "ok").putString("type", "basic")
				.putArray("appointments", arr);
		return ores;

	}

}
