/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.account;

import java.util.UUID;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;

public class ForgotPwdHandler implements Handler<Message<JsonObject>> {
	Server server;
	Logger log;
	JsonObject cfg;

	public ForgotPwdHandler(Server server, JsonObject cfg) {
		this.server = server;
		log = server.getContainer().logger();
		this.cfg=cfg;
	}

	@Override
	public void handle(Message<JsonObject> externalRequest) {
		final Cleaner cl = new Cleaner(externalRequest);
		try {
			final String username = cl.get("username", Cleaner.MAIL, false);
			final UserDetailHandler udh=new UserDetailHandler(server);
			udh.getUser(username, new Handler<JsonObject>() {

				@Override
				public void handle(JsonObject user) {
					if (user == null) {
						cl.replyError("user not found " + username);
					}else{
						JsonObject mail=cfg.getObject("mailer");
						mail.putString("to", username);
						String npw=UUID.randomUUID().toString();
						user.
						server.getContainer().deployModule(Server.MAILER,cfg.geto);
					}
				}
			});
		} catch (ParametersException pex) {
			log.error(pex.getMessage(), pex);
			cl.replyError("parameter error");
		}

	}

}
