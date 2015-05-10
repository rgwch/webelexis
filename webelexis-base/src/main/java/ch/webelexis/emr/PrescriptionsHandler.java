/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.emr;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import ch.webelexis.Cleaner;
import ch.webelexis.Mapper;
import ch.webelexis.ParametersException;

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
	
		}catch(ParametersException pex){
			
		}catch(Exception ex){
			
		}
		
		
	}

}
