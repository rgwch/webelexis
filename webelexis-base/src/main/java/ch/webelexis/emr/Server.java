package ch.webelexis.emr;

import org.vertx.java.busmods.BusModBase;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;

import ch.webelexis.AuthorizingHandler;

public class Server extends BusModBase {
	Logger log;
	JsonObject cfg;
	EventBus eb;
	
	@Override
	public void start(){
		log=container.logger();
		cfg=container.config();
		eb=vertx.eventBus();
		log.info("EMR Server started); got config "+cfg.encodePrettily());
		if(cfg.getBoolean("lab")==true){
			final LabResultHandler labResultHandler=new LabResultHandler();
			eb.registerHandler("ch.webelexis.emr.labresult", new AuthorizingHandler(this, cfg.getString("role","admin"), labResultHandler));
		}
	}
}
