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
import ch.webelexis.emr.LabResultSummaryHandler.SqlResult;

public class PrescriptionsHandler implements Handler<Message<JsonObject>> {
	Verticle v;
	EventBus eb;
	Logger log;
	static final String J_TABLE="PATIENT_ARTIKEL_JOINT";
	static final String ART_TABLE="ARTIKEL";
	String[] fields = new String[] { "j.PatientID, j.Artikel, j. RezeptID, j.DateFrom, j.DateUntil, j.Dosis, j.Anzahl, j.Bemerkung, j.ExtInfo"};
			
	public PrescriptionsHandler(Verticle server) {
		v = server;
		this.eb = v.getVertx().eventBus();
		this.log = v.getContainer().logger();
	}

	@Override
	public void handle(Message<JsonObject> externalRequest) {
		Cleaner cl=new Cleaner(externalRequest);
		try{
			log.debug("LabResultSummaryHandler: Handling " + externalRequest.body().encode());
			String patId = cl.get("patid", Cleaner.UID, false);
			Mapper mapper = new Mapper(fields);
			String sql="SELECT FIELDS FROM PATIENT_ARTIKEL_JOINT WHERE PatientID=? and deleted='0'";

			JsonObject jo = new JsonObject().putString("action", "prepared")
					.putString("statement", mapper.mapToString(sql, "FIELDS"))
					.putArray("values", new JsonArray(new String[] { patId }));
			log.debug("sending message :" + jo.encodePrettily());
			eb.send("ch.webelexis.sql", jo, new SqlResult(cl));

		} catch (ParametersException e) {
			e.printStackTrace();
			log.error("Parameter error " + cl.toString());
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
			log.debug("LabReuslt: Got answer from sql server: " + sqlAnswer.body().encodePrettily());
			JsonObject result = sqlAnswer.body();
			cl.reply(result);
		}
	}
}
