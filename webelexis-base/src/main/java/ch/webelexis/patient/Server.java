package ch.webelexis.patient;

import org.vertx.java.busmods.BusModBase;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.json.JsonObject;

import ch.webelexis.AuthorizingHandler;

public class Server extends BusModBase {
	
	EventBus eb(){
		return eb;
	}
	
	@Override
	public void start() {
		
		JsonObject cfg = container.config();
		eb.registerHandler("ch.webelexis.patient.summary",
				new AuthorizingHandler(eb, cfg.getString("role"),
						new PatientDetailHandler(this)));
	}
}
