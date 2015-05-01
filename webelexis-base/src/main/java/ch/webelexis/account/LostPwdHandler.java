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
import org.vertx.java.platform.Verticle;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;

/**
 * The user forgot their password, so we generate a random password and send
 * that by mail parameter: username
 * 
 * @author gerry
 *
 */
public class LostPwdHandler implements Handler<Message<JsonObject>> {
	Verticle server;
	Logger log;
	JsonObject cfg;

	public LostPwdHandler(Verticle server, JsonObject cfg) {
		this.server = server;
		log = server.getContainer().logger();
		this.cfg = cfg;
	}

	@Override
	public void handle(Message<JsonObject> externalRequest) {
		final Cleaner cl = new Cleaner(externalRequest);
		try {
			final String username = cl.get("username", Cleaner.MAIL, false);
			final UserDetailHandler udh = new UserDetailHandler(server);
			udh.getUser(username, new Handler<JsonObject>() {

				@Override
				public void handle(JsonObject user) {
					if (user == null) {
						cl.replyError("user not found " + username);
					} else {
						final JsonObject mailCfg = cfg.getObject("mails");
						final String newPassword = UUID.randomUUID().toString();
						user.putBinary("pwhash", UserDetailHandler.makeHash(username, newPassword));
						udh.putUser(user, new Handler<Boolean>() {

							@Override
							public void handle(Boolean result) {
								if (result) {
									String bcc = mailCfg.getString("bcc");
									String lpwd=mailCfg.getString("lostpwd_body");
									if(lpwd==null){
										cl.replyError("configuration error on server");
									}
									JsonObject mail = new JsonObject().putString("from", mailCfg.getString("from"))
												.putString("to", username).putString("subject",
															mailCfg.getString("lostpwd_subject")).putString(
															"body",
															mailCfg.getString("lostpwd_body").replaceFirst("%password%",
																		newPassword));
									if (bcc != null) {
										mail.putString("bcc", bcc);
									}
									server.getVertx().eventBus().send("ch.webelexis.mailer", mail,
												new Handler<Message<JsonObject>>() {

													@Override
													public void handle(Message<JsonObject> result) {
														if (result.body().getString("status").equals("ok")) {
															cl.replyOk();
														} else {
															cl.replyError("System error sending mail.");
															log.error("could not send mail. " + result.body().encode());
														}

													}
												});

								}

							}

						});

					}
				}
			});
		} catch (ParametersException pex) {
			log.error(pex.getMessage(), pex);
			cl.replyError("parameter error");
		}

	}

}
