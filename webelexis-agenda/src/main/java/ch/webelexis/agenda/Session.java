package ch.webelexis.agenda;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;

public class Session {
	EventBus eb;
	
	
	Session(EventBus eb) {
		this.eb = eb;
	}

	boolean authorize(String token) {
		eb.send("ch.webelexis.auth.authorize",
				new JsonObject().putString("SessionId", token),
				new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> event) {
						if (event.body().getString("status")
								.equalsIgnoreCase("ok")) {
							
						}

					}
				});
		return false;

	}

}
