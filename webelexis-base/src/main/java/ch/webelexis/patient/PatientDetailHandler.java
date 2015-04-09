package ch.webelexis.patient;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

import ch.webelexis.Cleaner;

public class PatientDetailHandler implements Handler<Message<JsonObject>> {
	private String tid = "7ba4632caba62c5b3a366";
	private String[] fields = { "k.patientnr", "k.Bezeichnung1",
			"k.Bezeichnung2", "k.geschlecht", "k.Strasse", "k.plz", "k.Ort",
			"k.telefon1", "k.telefon2", "k.natelnr", "k.email", "k.gruppe",
			"k.bemerkung" };

	Server server;

	PatientDetailHandler(Server s) {
		server = s;
	}

	@Override
	public void handle(Message<JsonObject> externalRequest) {
		Cleaner cl = new Cleaner(externalRequest);
		String patId = cl.get("patid", Cleaner.NOTEMPTY);
		String sql = "SELECT " + String.join(",", fields)
				+ " from KONTAKT as k where k.id=?";
		JsonObject jo = new JsonObject().putString("action", "prepared")
				.putString("statement", sql)
				.putArray("values", new JsonArray(new String[] { patId }));
		server.eb().send("ch.webelexis.sql", jo,
				new PatDataHandler(externalRequest));
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
				req.reply(new JsonObject().putString("status", "ok").putObject(
						"patient", jPat));
			}else{
				server.log().error(j.getString("status"));
				req.reply(new JsonObject().putString("status", "SQL error"));
			}

		}

	}

	JsonObject ArrayToObject(JsonArray fields, JsonArray results) {
		JsonObject ret = new JsonObject();
		for (int i = 0; i < fields.size(); i++) {
			ret.putString(((String)fields.get(i)).toLowerCase(), (String)results.get(i));
		}
		return ret;
	}
}
