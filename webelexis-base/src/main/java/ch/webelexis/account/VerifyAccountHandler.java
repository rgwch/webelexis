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

public class VerifyAccountHandler implements Handler<Message<JsonObject>> {
	Server server;
	Logger log;

	public VerifyAccountHandler(Server server) {
		this.server = server;
		log = server.getContainer().logger();
	}

	@Override
	public void handle(Message<JsonObject> externalRequest) {
		final Cleaner cl = new Cleaner(externalRequest);
		try {
			final String uname = cl.get("username", Cleaner.MAIL, false);
			String code = cl.get("verify", Cleaner.UID, false);
			JsonObject op = new JsonObject().putString("action", "findone").putObject("matcher",
						new JsonObject().putString("username", uname).putString("verify", code)).putString(
						"collection", "users");
			server.getVertx().eventBus().send("ch.webelexis.nosql", op,
						new Handler<Message<JsonObject>>() {

							@Override
							public void handle(Message<JsonObject> nosqlAnswer) {
								JsonObject result = nosqlAnswer.body();
								if (result.getString("status").equals("ok")) {
									JsonObject user = result.getObject("result");
									if (user == null) {
										cl.replyError("user not found");
									} else {
										user.putBoolean("active", true);
										user.removeField("verify");
										JsonObject op = new JsonObject().putString("action", "update").putString(
													"collection", "users").putObject("criteria",
													new JsonObject().putString("username", uname)).putObject("objNew", user)
													.putBoolean("upsert", false).putBoolean("multi", false);
										server.getVertx().eventBus().send("ch.webelexis.nosql", op,
													new Handler<Message<JsonObject>>() {

														@Override
														public void handle(Message<JsonObject> ans) {
															if (ans.body().getString("status").equals("ok")) {
																cl.replyOk();
															} else {
																cl.replyError(ans.body().getString("message"));
																log.error(ans.body().encode());
															}

														}
													});
									}
								} else {
									cl.replyError("database error");
								}
							}
						});
		} catch (ParametersException pex) {
			log.error(pex.getMessage(), pex);
			cl.replyError("parameter error");

		}
	}

}
