package ch.webelexis;

import org.vertx.java.busmods.BusModBase;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;

public class AuthorizingHandler implements Handler<Message<JsonObject>> {
	Handler<Message<JsonObject>> realHandler;
	String roleToCheck;
	BusModBase bm;

	public AuthorizingHandler(BusModBase server, String roleToCheck,
			Handler<Message<JsonObject>> originalHandler) {
		realHandler = originalHandler;
		this.roleToCheck = roleToCheck;
		this.bm = server;

	}

	@Override
	public void handle(final Message<JsonObject> originalMsg) {
		bm.getContainer().logger().debug(originalMsg.body().encodePrettily());
		final Cleaner cl = new Cleaner(originalMsg);
		if (roleToCheck == null || roleToCheck.length() == 0) {
			originalMsg.reply(new JsonObject().putString("status", "denied").putString("message",
					"roleToCheck missing")); // + cl.get("address",
																		// Cleaner.NOTEMPTY)));
		} else {
			if (roleToCheck.equalsIgnoreCase("guest")) {
				realHandler.handle(originalMsg);
			} else {
				try {
					bm.getVertx()
							.eventBus()
							.send(
									"ch.webelexis.session.authorize",
									new JsonObject().putString("role", roleToCheck).putString("sessionID",
											cl.get("sessionID", Cleaner.NAME, false)), new Handler<Message<JsonObject>>() {

										@Override
										public void handle(Message<JsonObject> authMsg) {
											if (authMsg.body().getString("status").equals("ok")) {
												originalMsg.body().putObject("authorized_user",
														authMsg.body().getObject("authorized_user"));
												realHandler.handle(originalMsg);
											} else {
												originalMsg.reply(new JsonObject().putString("status", "denied").putString("message",
														" insufficient rights for resource. Required " + roleToCheck)); // +
												// cl.get("address",
												// Cleaner.NOTEMPTY)));
											}
										}
									});
				} catch (ParametersException pex) {
					bm.getContainer().logger().error(pex.getMessage(), pex);
					cl.replyError("parameter error");
				}
			}
		}

	}

}
