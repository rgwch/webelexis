package ch.webelexis.account;

/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
import java.util.Arrays;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;

/**
 * The user wants to change their password parameters:username, old-pwd, new-pwd
 * 
 * @author gerry
 *
 */
public class ChangePwdHandler implements Handler<Message<JsonObject>> {
	Verticle server;
	Logger log;
	JsonObject cfg;
	UserDetailHandler udh;

	public ChangePwdHandler(Verticle server, JsonObject cfg) {
		this.server = server;
		log = server.getContainer().logger();
		this.cfg = cfg;
		udh = new UserDetailHandler(server);
	}

	@Override
	public void handle(Message<JsonObject> externalRequest) {
		final Cleaner cl = new Cleaner(externalRequest);
		try {
			final String username = cl.get("username", Cleaner.MAIL, false);
			final String oldPwd = cl.get("old-pwd", Cleaner.NOTEMPTY, false);
			final String newPwd = cl.get("new-pwd", Cleaner.NOTEMPTY, false);
			udh.getUser(username, new Handler<JsonObject>() {

				@Override
				public void handle(JsonObject user) {
					if (user == null) {
						cl.replyError("user not found");
					} else {
						byte[] checkBytes = UserDetailHandler.makeHash(username, oldPwd);
						byte[] userBytes=user.getBinary("pwhash");
						if(userBytes==null){
							userBytes=UserDetailHandler.makeHash(username, user.getString("password"));
							user.removeField("password");
						}
						if (Arrays.equals(userBytes, checkBytes)) {
							user.putBinary("pwhash", UserDetailHandler.makeHash(username, newPwd));
							udh.putUser(user, new Handler<Boolean>() {

								@Override
								public void handle(Boolean result) {
									if (result) {
										cl.replyOk();
									} else {
										log.error("could not update password");
										cl.replyError("system error: Could not update password");
									}

								}
							});
						} else {
							cl.replyError("bad password");
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
