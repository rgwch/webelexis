package ch.webelexis.emr;

import java.util.Iterator;

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

public class LabResultHandler implements Handler<Message<JsonObject>> {
	Verticle v;
	EventBus eb;
	Logger log;
	String[] fields = new String[] { "v.Datum", "v.ItemID", "v.Resultat", "v.Kommentar",
				"li.kuerzel", "li.titel", "li.Gruppe", "li.prio", "li.RefMann", "li.RefFrauOrTx" };

	public LabResultHandler(Verticle server) {
		v = server;
		this.eb = v.getVertx().eventBus();
		this.log = v.getContainer().logger();
	}

	@Override
	public void handle(Message<JsonObject> externalRequest) {
		Cleaner cl = new Cleaner(externalRequest);
		try {
			String patId = cl.get("patientid", Cleaner.UID, false);
			String dateFrom = cl.get("from", Cleaner.ELEXISDATE, false);
			String dateUntil=  cl.get("until", Cleaner.ELEXISDATE, false);
			if (dateFrom == null) {
				dateFrom = "20000101";
			}
			Mapper mapper = new Mapper(fields);
			String query = "SELECT FIELDS FROM LABORWERTE as v, LABORITEMS as li where v.Datum>=? and v.Datum<=? and v.PatientID=? and v.ItemID=li.id";

			JsonObject jo = new JsonObject().putString("action", "prepared").putString("statement",
						mapper.mapToString(query, "FIELDS")).putArray("values",
						new JsonArray(new String[] { dateFrom, dateUntil, patId }));
			log.debug("sending message :" + jo.encodePrettily());
			eb.send("ch.webelexis.sql", jo, new SqlResult(cl, mapper));

		} catch (ParametersException e) {
			e.printStackTrace();
			cl.replyError("parameter error");
		}
	}

	class SqlResult implements Handler<Message<JsonObject>> {
		Cleaner cl;
		Mapper mapper;

		SqlResult(Cleaner c, Mapper m) {
			this.cl = c;
			mapper = m;
		}

		@Override
		public void handle(Message<JsonObject> sqlAnswer) {
			JsonObject result = sqlAnswer.body();
			if (result.getString("status").equals("ok")) {
				JsonArray labValues = result.getArray("results");
				JsonArray ja = new JsonArray();
				Iterator<Object> it = labValues.iterator();
				while (it.hasNext()) {
					JsonArray row = (JsonArray) it.next();
					JsonObject item = mapper.mapToJson(row.toArray());
					ja.add(item);
				}
				cl.reply(new JsonObject().putString("status", "ok").putArray("results", ja));
			} else {
				log.error(result.encodePrettily());
				cl.replyError("SQL Error");
			}
		}

	}

}
