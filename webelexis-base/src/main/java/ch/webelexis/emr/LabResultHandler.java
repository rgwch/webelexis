package ch.webelexis.emr;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;

public class LabResultHandler implements Handler<Message<JsonObject>> {
	Verticle v;
	EventBus eb;
	Logger log;

	public LabResultHandler() {
		v = Server.instance;
		this.eb = v.getVertx().eventBus();
		this.log = v.getContainer().logger();
	}

	@Override
	public void handle(Message<JsonObject> externalRequest) {
		Cleaner cl = new Cleaner(externalRequest);
		try {
			String patId = cl.get("patientid", Cleaner.UID, false);
			String dateFrom = cl.get("from", Cleaner.ELEXISDATE, true);
			if (dateFrom == null) {
				dateFrom = "20000101";
			}
			JsonObject jo = new JsonObject()
					.putString("action", "prepared")
					.putString("statement",
							"SELECT Datum, ItemID, Resultat, Kommentar FROM LABOWERTE where Datum>=? and Datum<=? and PatientID=?")
					.putArray("values", new JsonArray(new String[] { dateFrom, "20991231", patId }));
			log.debug("sending message :" + jo.encodePrettily());
			eb.send("ch.webelexis.emr.labresult", jo, new SqlResult(cl));

		} catch (ParametersException e) {
			e.printStackTrace();
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
			List<LabResult> labResults = new ArrayList<LabResult>(50);
			JsonObject result = sqlAnswer.body();
			if (result.getString("status").equals("ok")) {
				JsonArray labValues = result.getArray("results");
				Iterator<Object> it = labValues.iterator();
				while (it.hasNext()) {
					LabResult res = new LabResult((JsonArray) it.next());
					labResults.add(res);
				}
				JsonArray ja = new JsonArray();
				for (LabResult lr : labResults) {
					ja.add(lr.get());
				}
				cl.reply(new JsonObject().putString("status", "ok").putArray("results", ja));
			} else {
				log.error(result.encodePrettily());
				cl.replyError("SQL Error");
			}
		}

	}

}
