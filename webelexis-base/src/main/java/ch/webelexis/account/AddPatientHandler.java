/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.account;

import static ch.webelexis.Cleaner.ELEXISDATE;
import static ch.webelexis.Cleaner.MAIL;
import static ch.webelexis.Cleaner.NAME;
import static ch.webelexis.Cleaner.PHONE;
import static ch.webelexis.Cleaner.ZIP;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;

public class AddPatientHandler implements Handler<Message<JsonObject>> {
	Verticle server;
	JsonObject cfg;
	Logger log;
	EventBus eb;

	private String[] fields = { "id", "Bezeichnung1", "Bezeichnung2", "Geburtsdatum", "Strasse", "Plz", "Ort",
			"Telefon1", "NatelNr", "Email", "Bemerkung" };

	public AddPatientHandler(Verticle server, JsonObject cfg) {
		this.server = server;
		this.cfg = cfg;
		log = server.getContainer().logger();
		eb = server.getVertx().eventBus();
	}

	@Override
	public void handle(final Message<JsonObject> externalRequest) {
		log.info("add patient: " + externalRequest.body().encodePrettily());
		final Cleaner c = new Cleaner(externalRequest);

		try {
			// check if username exists in webelexis users
			JsonObject op = new JsonObject().putString("action", "findone").putString("collection", "users")
					.putObject("matcher", new JsonObject().putString("username", c.get("username", MAIL, false)));
			eb.send("ch.webelexis.nosql", op, new Handler<Message<JsonObject>>() {

				@Override
				public void handle(final Message<JsonObject> mongoRequest) {
					if (mongoRequest.body().getString("status").equals("ok")) {
						if (mongoRequest.body().getObject("result") != null) {
							log.warn("user exists " + externalRequest.body().getString("username"));
							/* user exists: error */
							c.replyStatus("user exists");
						} else {
							try {
								/* user does not exist; check if patient exists */
								String sql = "select id from KONTAKT where Bezeichnung1=? and Bezeichnung2=? and Geburtsdatum=?";
								JsonObject jo = new JsonObject()
										.putString("action", "prepared")
										.putString("statement", sql)
										.putArray(
												"values",
												new JsonArray(new String[] { c.get("name", NAME, false),
														c.get("vorname", NAME, false), c.get("geburtsdatum", ELEXISDATE, false) }));
								eb.send("ch.webelexis.sql", jo, new QueryResultHandler(c));
							} catch (ParametersException pex) {
								log.error(pex.getMessage(), pex);
								c.replyError("parameter error");
							}
						}
					} else {
						c.replyError("mongo database failure");
					}
				}
			});
		} catch (ParametersException pex) {
			log.error(pex.getMessage(), pex);
			c.replyError("parameter error");
		}
	}

	class QueryResultHandler implements Handler<Message<JsonObject>> {

		Cleaner c;

		QueryResultHandler(Cleaner externalRequestCleaner) {
			c = externalRequestCleaner;
		}

		@Override
		public void handle(final Message<JsonObject> result) {
			JsonObject rb = result.body();
			log.debug("SQL user answer: "+rb.encodePrettily());
			if (rb.getString("status").equals("ok")) {
				if (rb.getArray("results").size() > 0) {
					/* Patient exists, just create user */
					JsonArray row = rb.getArray("results").get(0);
					final String pid = row.get(0);
					addUser(c, pid);
				} else {
					try {
						/* create Patient and user */
						String pid = UUID.randomUUID().toString();
						log.debug("creating Elexis user "+pid);
						JsonArray row = new JsonArray().addString(pid).addString(c.get("name", NAME, false))
								.addString(c.get("vorname", NAME, false)).addString(c.get("geburtsdatum", ELEXISDATE, false))
								.addString(c.get("strasse", NAME, true)).addString(c.get("plz", ZIP, true))
								.addString(c.get("ort", NAME, true)).addString(c.get("telefon", PHONE, true))
								.addString(c.get("mobil", PHONE, true)).addString(c.get("email", MAIL, false))
								.addString("via webelexis");
						JsonArray values = new JsonArray().add(row);
						JsonObject sql = new JsonObject().putString("action", "insert").putString("table", "KONTAKT")
								.putArray("fields", new JsonArray(fields)).putArray("values", values);
						eb.send("ch.webelexis.sql", sql, new SqlResultHandler(c, pid));
					} catch (ParametersException pex) {
						log.error(pex.getMessage(), pex);
						c.replyError("parameter error");
					}

				}
			} else {
				log.error(rb.getString("status") + " " + rb.getString("message"));
				c.replyError();
			}
		}

	}

	/* called after created new patient */
	class SqlResultHandler implements Handler<Message<JsonObject>> {
		Cleaner c;
		String pid;

		SqlResultHandler(Cleaner externalRequestCleaner, String pid) {
			c = externalRequestCleaner;
			this.pid = pid;
		}

		@Override
		public void handle(final Message<JsonObject> result) {
			if (result.body().getString("status").equals("ok")) {
				addUser(c, pid);
			} else {
				log.error(result.body().encodePrettily());
				c.replyError();
			}

		}
	}

	void addUser(final Cleaner cle, final String pid) {
		log.debug("mongo insert: " + cle.toString());
		try {
			final JsonObject user = new JsonObject().putString("username", cle.get("username", MAIL, false))
					.putString("patientid", pid).putString("firstname", cle.get("vorname", NAME, false))
					.putString("lastname", cle.get("name", NAME, false));
			user.putArray("roles", new JsonArray().addString(cfg.getString("defaultRole")));
			String pwd = cle.getOptional("pass", null);
			if (pwd != null) {
				user.putBinary("pwhash", makeHash(user.getString("username"), pwd));
			}
			JsonObject op = new JsonObject().putString("action", "save").putString("collection", "users")
					.putObject("document", user);
			eb.send("ch.webelexis.nosql", op, new Handler<Message<JsonObject>>() {

				@Override
				public void handle(Message<JsonObject> reply) {
					// that's it, everything went successfully. Send User a confirmation
					// mail

					if (cfg.getBoolean("confirm-mail", false)) {
						final JsonObject mailer = cfg.getObject("mailer");
						user.putString("confirmID", UUID.randomUUID().toString());
						mailer.putString("to", user.getString("username"));
						mailer.putString("body",
								mailer.getString("body").replaceFirst("%url%", user.getString("confirmID")));
						server.getContainer().deployModule("io.vertx~mod-mailer~2.0.0-final", mailer,
								new AsyncResultHandler<String>() {

									@Override
									public void handle(AsyncResult<String> mailerResult) {
										if (mailerResult.succeeded()) {
											eb.send("ch.webelexis.mailer", mailer, new Handler<Message<JsonObject>>() {

												@Override
												public void handle(Message<JsonObject> mailerReply) {
													if (mailerReply.body().getString("status").equals("ok")) {
														cle.replyOk();
													} else {
														log.error("mailer error: " + mailerReply.body().encodePrettily());
														cle.replyError("mail error");
													}
												}
											});

										} else {
											log.error("error launching mailer " + mailerResult.result());
											cle.replyError("mail error");
										}
									}
								});

					} else { // no confirmation mail
						cle.reply(reply.body());
					}
				}

			});

		} catch (ParametersException pex) {
			log.error(pex.getMessage(), pex);
			cle.replyError("parameter error");

		}
	}

	private byte[] makeHash(String username, String password) {
		try {

			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(username.getBytes("utf-8"));
			return md.digest(password.getBytes("utf-8"));

		} catch (NoSuchAlgorithmException e) {
			log.fatal("could not create password hash MD5", e);
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			log.fatal("don't know how to handle utf-8", e);
			e.printStackTrace();
		}
		return null;
	}
}