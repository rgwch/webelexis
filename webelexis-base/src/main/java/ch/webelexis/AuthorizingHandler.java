package ch.webelexis;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;

public class AuthorizingHandler implements Handler<Message<JsonObject>> {
	Handler<Message<JsonObject>> realHandler;
	
	public AuthorizingHandler(Handler<Message<JsonObject>> originalHandler) {
		realHandler=originalHandler;

	}
	@Override
	public void handle(Message<JsonObject> msg) {
			realHandler.handle(msg);
	}

}
