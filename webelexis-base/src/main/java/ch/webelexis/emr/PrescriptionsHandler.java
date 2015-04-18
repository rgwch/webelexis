package ch.webelexis.emr;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;

import ch.webelexis.Cleaner;

public class PrescriptionsHandler implements Handler<Message<JsonObject>> {

	@Override
	public void handle(Message<JsonObject> externalRequest) {
		Cleaner cl=new Cleaner(externalRequest);
		
		
		
	}

}
