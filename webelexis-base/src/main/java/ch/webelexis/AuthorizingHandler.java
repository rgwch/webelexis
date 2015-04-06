package ch.webelexis;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;

public class AuthorizingHandler implements Handler<Message<JsonObject>> {
	Handler<Message<JsonObject>> realHandler;
	String roleToCheck;
	EventBus eb;

	public AuthorizingHandler(EventBus eb, String roleToCheck, Handler<Message<JsonObject>> originalHandler) {
		realHandler = originalHandler;
		this.roleToCheck = roleToCheck;
		this.eb = eb;
	}

	@Override
	public void handle(Message<JsonObject> originalMsg) {
		Cleaner cl = new Cleaner(originalMsg);
		if (roleToCheck == null || roleToCheck.length() == 0) {
			originalMsg.reply(new JsonObject().putString("status", "denied").putString("message",
					"insufficient rights for resource " + cl.get("address", Cleaner.NAME)));
		} else {
			if (roleToCheck.equalsIgnoreCase("guest")) {
				realHandler.handle(originalMsg);
			} else {
				eb.send("ch.webelexis.session.authorize",
						new JsonObject().putString("role", roleToCheck).putString("sessionID", cl.get("sessionID", Cleaner.NAME)),
						new Handler<Message<JsonObject>>() {

							@Override
							public void handle(Message<JsonObject> authMsg) {
								if (authMsg.body().getString("status").equals("ok")) {
									realHandler.handle(originalMsg);
								} else {
									originalMsg.reply(new JsonObject().putString("status", "denied").putString("message",
											"insufficient rights for resource " + cl.get("address", Cleaner.NAME)));
								}
							}
						});
			}
		}

	}

}
