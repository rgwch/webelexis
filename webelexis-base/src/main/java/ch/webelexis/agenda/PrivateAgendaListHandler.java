package ch.webelexis.agenda;

import static ch.webelexis.Cleaner.ELEXISDATE;
import static ch.webelexis.Cleaner.NAME;
import static ch.webelexis.Cleaner.WORD;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.json.impl.Json;
import org.vertx.java.core.logging.Logger;

import ch.webelexis.Cleaner;

public class PrivateAgendaListHandler implements Handler<Message<JsonObject>> {
	EventBus eb;
	JsonObject cfg;
	Logger log = Server.log;

	public PrivateAgendaListHandler(EventBus eb, JsonObject cfg) {
		this.eb = eb;
		this.cfg = cfg;
	}

	@Override
	public void handle(Message<JsonObject> externalRequest) {
		/**
		 * This is, what an authorized user gets. Due to an ill-designed database
		 * layout, a single join does not return all appointments, since the "PatID"
		 * field is dual use: either it's a patient id (which would be covered by
		 * the join in the first place) or it is just a manually entered description
		 * or a name for the appointment (and such appointments are lost with the
		 * join) Therefore we must make 2 database calls. One for the joint and one
		 * for all appointments of the given date. (Oh, there would be an SQL join
		 * to cover that case with a single call indeed, but -the heck- this does
		 * not work with the mysql-jdbc-driver.)
		 * 
		 * The original implementation of elexis does this even worse: It makes a
		 * separate database call for every single entry. This would be very
		 * inefficient over slow internet connections.
		 * 
		 * @param event
		 * @param request
		 */
		// first call: get all Appointments with valid PatientID
		log.info("authorized agenda handler");
		final Cleaner cl = new Cleaner(externalRequest);
		JsonObject bridge = new JsonObject()
					.putString("action", "prepared")
					.putString(
								"statement",
								"SELECT A.Tag,A.Beginn,A.Dauer, A.Bereich, A.TerminTyp, A.ID, A.PatID,A.TerminStatus,A.Grund,K.Bezeichnung1,K.Bezeichnung2, K.geburtsdatum from AGNTERMINE as A, KONTAKT as K where K.id=A.PatID and A.Tag>=? and A.Tag <=? and A.Bereich=? and A.deleted='0'")
					.putArray(
								"values",
								new JsonArray(new String[] { cl.get("begin", ELEXISDATE),
											cl.get("end", ELEXISDATE), cl.get("resource", NAME) }));
		System.out.println(bridge.toString());
		eb.send("ch.webelexis.sql", bridge, new firstLevel(externalRequest));
	}

	class firstLevel implements Handler<Message<JsonObject>> {
		Message<JsonObject> externalRequest;

		firstLevel(Message<JsonObject> externalRequest) {
			this.externalRequest = externalRequest;
		}

		@Override
		public void handle(Message<JsonObject> sqlResult1) {
			Cleaner cl = new Cleaner(sqlResult1);
			if (cl.get("status", WORD).equals("ok")) {

				final JsonArray appts = cl.getArray("results", new JsonArray());
				log.debug("first level okay with " + appts.size() + " results");

				JsonObject bridge = new JsonObject()
							.putString("action", "prepared")
							.putString(
										"statement",
										"SELECT Tag,Beginn,Dauer,Bereich, TerminTyp, ID, PatID, TerminStatus, Grund from AGNTERMINE where Tag>=? and Tag <=? and Bereich=? and deleted='0'")
							.putArray(
										"values",
										new JsonArray(new String[] { cl.get("begin", ELEXISDATE),
													cl.get("end", ELEXISDATE), cl.get("resource", NAME) }));
				eb.send("ch.webelexis.sql", bridge, new secondLevel(externalRequest,appts));

			} else {
				log.info("first level failed " + sqlResult1.body().getString("message"));
				System.out.println(Json.encodePrettily(sqlResult1.body()));
				externalRequest.reply(new JsonObject().putString("status", "failure"));
			}

		}

	}

	class secondLevel implements Handler<Message<JsonObject>> {
		Message<JsonObject> externalRequest;
		JsonArray appts;

		secondLevel(Message<JsonObject> externalRequest, JsonArray appts) {
			this.externalRequest = externalRequest;
			this.appts=appts;
		}

		@Override
		public void handle(Message<JsonObject> second) {
			if (second.body().getString("status").equals("ok")) {
				Server.log.debug("second level okay");
				JsonObject ores = fillBlanks(appts.toArray(), second.body().getArray("results"));
				ores.putString("type", "full");
				externalRequest.reply(ores);
			} else {
				Server.log.info("second level failed");
				System.out.println(Json.encodePrettily(second.body()));
				externalRequest.reply(new JsonObject().putString("status", "failure").putString("reason",
							second.body().getString("status")));
			}
		}
		
		private JsonObject fillBlanks(Object[] a1, JsonArray a2){
			return new JsonObject();
		}
	}

	
}
