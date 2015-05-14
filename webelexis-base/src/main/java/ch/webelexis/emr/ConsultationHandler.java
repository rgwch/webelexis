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
import ch.webelexis.ParametersException;

public class ConsultationHandler implements Handler<Message<JsonObject>> {
	Verticle v;
	EventBus eb;
	Logger log;

	public ConsultationHandler(Verticle server) {
		v = server;
		this.eb = v.getVertx().eventBus();
		this.log = v.getContainer().logger();
	}

	@Override
	public void handle(Message<JsonObject> externalRequest) {
		Cleaner cl=new Cleaner(externalRequest);
		try{
			final String patid=cl.get("patid", Cleaner.UID, false);
			
		}catch(ParametersException pex){
			log.error(pex.getStackTrace());
			cl.replyError(pex.getMessage());
		}
	}

}
