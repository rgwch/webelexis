/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.account;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;

public class PatientDetailHandler implements Handler<Message<JsonObject>> {
	private String tid = "7ba4632caba62c5b3a366";
	private String[] fields = { "k.patientnr", "k.Bezeichnung1", "k.Bezeichnung2", "k.geschlecht", "k.geburtsdatum",
			"k.Strasse", "k.plz", "k.Ort", "k.telefon1", "k.telefon2", "k.natelnr", "k.email", "k.gruppe", "k.bemerkung" };

	Verticle server;
	EventBus eb;
	Logger log;
	
	PatientDetailHandler(Verticle s) {
		server = s;
		eb=s.getVertx().eventBus();
		log=s.getContainer().logger();
	}

	@Override
	public void handle(Message<JsonObject> externalRequest) {
		Cleaner cl = new Cleaner(externalRequest);
		try {
			String patId = cl.get("patid", Cleaner.NAME, false);
			String sql = "SELECT " + String.join(",", fields) + " from KONTAKT as k where k.id=?";
			JsonObject jo = new JsonObject().putString("action", "prepared").putString("statement", sql)
					.putArray("values", new JsonArray(new String[] { patId }));
			eb.send("ch.webelexis.sql", jo, new PatDataHandler(externalRequest));
		} catch (ParametersException pex) {
			cl.replyError("parameter error");
		}
	}

	class PatDataHandler implements Handler<Message<JsonObject>> {
		Message<JsonObject> req;

		public PatDataHandler(Message<JsonObject> externalRequest) {
			req = externalRequest;
		}

		@Override
		public void handle(Message<JsonObject> patData) {
			JsonObject j = patData.body();
			if (j.getString("status").equals("ok")) {
				int rows = j.getInteger("rows");
				JsonArray fields = j.getArray("fields");
				JsonArray results = patData.body().getArray("results").get(0);
				JsonObject jPat = ArrayToObject(fields, results);
				req.reply(new JsonObject().putString("status", "ok").putObject("patient", jPat));
			} else {
				log.error(j.getString("status"));
				req.reply(new JsonObject().putString("status", "SQL error"));
			}

		}

	}

	JsonObject ArrayToObject(JsonArray fields, JsonArray results) {
		JsonObject ret = new JsonObject();
		for (int i = 0; i < fields.size(); i++) {
			ret.putString(((String) fields.get(i)).toLowerCase(), (String) results.get(i));
		}
		return ret;
	}
}
