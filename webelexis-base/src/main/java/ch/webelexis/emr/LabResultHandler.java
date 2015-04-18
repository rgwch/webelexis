package ch.webelexis.emr;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;

public class LabResultHandler implements Handler<Message<JsonObject>> {
	Verticle v;
	EventBus eb;
	Logger log;
	public LabResultHandler(Verticle verticle){
		this.v=verticle;
		this.eb=verticle.getVertx().eventBus();
		this.log=verticle.getContainer().logger();
	}
	
	@Override
	public void handle(Message<JsonObject> externalRequest) {
		Cleaner cl=new Cleaner(externalRequest);
		try {
			String patId=cl.get("patientid", Cleaner.UID, false);
			
		} catch (ParametersException e) {
			e.printStackTrace();
			cl.replyError("parameter error");
		}
	}

}
