/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.patient;

import org.vertx.java.busmods.BusModBase;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;

import ch.webelexis.AuthorizingHandler;
import ch.webelexis.VertxAccess;

public class Server extends BusModBase implements VertxAccess{
	
	@Override
	public void start() {
		super.start();
		JsonObject cfg = container.config();
		JsonObject cAdd = cfg.getObject("add", new JsonObject().putString("role", "admin"));
		eb.registerHandler("ch.webelexis.patient.detail",
				new AuthorizingHandler(this, cfg.getObject("detail", new JsonObject()).getString("role", "admin"),
						new PatientDetailHandler(this)));
		eb.registerHandler("ch.webelexis.patient.add", new AuthorizingHandler(this, cAdd.getString("role"),
				new AddPatientHandler(this, cAdd)));
	}

	@Override
	public Logger getLog() {
		return logger;
	}

	@Override
	public EventBus getEventBus() {
		return eb;
	}
}
