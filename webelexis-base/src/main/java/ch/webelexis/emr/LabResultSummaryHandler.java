/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.emr;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import ch.webelexis.Cleaner;
import ch.webelexis.Mapper;
import ch.webelexis.ParametersException;

/**
 * Quite simple: Just return all lab results of a given patient. For efficiency reasons, we fetch all interesting fields in a single join.
 * @author gerry
 *
 */
public class LabResultSummaryHandler implements Handler<Message<JsonObject>> {
	Verticle v;
	EventBus eb;
	Logger log;
	String[] fields = new String[] { "v.Datum", "v.ItemID", "li.titel", "v.Resultat", "v.Kommentar",
				"li.kuerzel", "li.Gruppe", "li.prio", "li.RefMann", "li.RefFrauOrTx" };

	public LabResultSummaryHandler(Verticle server) {
		v = server;
		this.eb = v.getVertx().eventBus();
		this.log = v.getContainer().logger();
	}

	@Override
	public void handle(Message<JsonObject> externalRequest) {
		Cleaner cl = new Cleaner(externalRequest);
		try {
			log.debug("LabResultSummaryHandler: Handling "+externalRequest.body().encode());
			String patId = cl.get("patid", Cleaner.UID, false);
			Mapper mapper = new Mapper(fields);
			String query = "SELECT FIELDS FROM LABORWERTE as v, LABORITEMS as li where v.PatientID=? and v.ItemID=li.id and v.deleted='0' order by v.Datum";

			JsonObject jo = new JsonObject().putString("action", "prepared").putString("statement",
						mapper.mapToString(query, "FIELDS")).putArray("values",
						new JsonArray(new String[] { patId }));
			log.debug("sending message :" + jo.encodePrettily());
			eb.send("ch.webelexis.sql", jo, new SqlResult(cl));

		} catch (ParametersException e) {
			e.printStackTrace();
			log.error("Parameter error "+cl.toString());
			cl.replyError("parameter error");
		}
	}

	class SqlResult implements Handler<Message<JsonObject>> {
		Cleaner cl;

		SqlResult(Cleaner c) {
			this.cl = c;
		}

		@Override
		public void handle(Message<JsonObject> sqlAnswer) {
			log.debug("LabReuslt: Got answer from sql server: "+sqlAnswer.body().encodePrettily());
			JsonObject result = sqlAnswer.body();
			cl.reply(result);
		}
	}
}
