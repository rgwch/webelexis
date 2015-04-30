/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.account;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;

/**
 * A new user has been created. If they enter the correct code which was sent
 * per mail, the account becomes active.<br>
 * parameters: username, verify (the verification code)
 * 
 * @author gerry
 *
 */
public class VerifyAccountHandler implements Handler<Message<JsonObject>> {
	Server server;
	Logger log;
	UserDetailHandler udh;

	public VerifyAccountHandler(Server server) {
		this.server = server;
		log = server.getContainer().logger();
		udh = new UserDetailHandler(server);
	}

	@Override
	public void handle(Message<JsonObject> externalRequest) {
		final Cleaner cl = new Cleaner(externalRequest);
		try {
			final String uname = cl.get("username", Cleaner.MAIL, false);
			final String code = cl.get("verify", Cleaner.UID, false);
			udh.getUser(uname, new Handler<JsonObject>() {
				@Override
				public void handle(JsonObject user) {
					if (user == null) {
						cl.replyError("user not found");
					} else {
						if (user.getString("confirmID").equals(code)) {

							user.putBoolean("verified", true);
							user.removeField("confirmID");
							udh.putUser(user, new Handler<Boolean>() {
								@Override
								public void handle(Boolean result) {
									if (result) {
										cl.replyOk();
									} else {
										cl.replyError("system error: Could not write user");
									}
								}
							});
						} else {
							cl.replyError("bad verification code");
						}
					}
				}
			});
		} catch (ParametersException pex) {
			log.error(pex.getMessage(), pex);
			cl.replyError("parameter error");
		}
	}
}
