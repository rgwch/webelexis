/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis;

import org.vertx.java.busmods.BusModBase;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;

/**
 * A handler proxy for authorization. Checks first, if the user has the role
 * needed for the requested task and either forwards the call to the real
 * handler, or rejects it with a "denied" message to the caller
 * 
 * @author gerry
 *
 */
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
						"roleToCheck missing"));
		} else {
			// access to resources for "guest" is always granted
			if (roleToCheck.equalsIgnoreCase("guest")) {
				realHandler.handle(originalMsg);
			} else {
				try {
					bm.getVertx().eventBus().send(
								"ch.webelexis.session.authorize",
								new JsonObject().putString("role", roleToCheck).putString("sessionID",
											cl.get("sessionID", Cleaner.NAME, false)),
								new Handler<Message<JsonObject>>() {

									@Override
									public void handle(Message<JsonObject> authMsg) {
										if (authMsg.body().getString("status").equals("ok")) {
											bm.getContainer().logger().debug(
														"AuthorizingHandler: " + authMsg.body().encodePrettily());
											originalMsg.body().putObject("authorized_user",
														authMsg.body().getObject("authorized_user"));
											realHandler.handle(originalMsg);
										} else {
											originalMsg.reply(new JsonObject().putString("status", "denied")
														.putString("message",
																	" insufficient rights for resource. Required " + roleToCheck));
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
