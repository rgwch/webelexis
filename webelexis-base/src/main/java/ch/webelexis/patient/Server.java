package ch.webelexis.patient;

import org.vertx.java.busmods.BusModBase;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;

import ch.webelexis.AuthorizingHandler;

public class Server extends BusModBase {
	
	EventBus eb(){
		return eb;
	}
	
	Logger log(){
		return logger;
	}
	
	@Override
	public void start() {
		super.start();
		JsonObject cfg = container.config();
		eb.registerHandler("ch.webelexis.patient",
				new AuthorizingHandler(eb, cfg.getString("role"),
						new PatientDetailHandler(this)));
	}
}
