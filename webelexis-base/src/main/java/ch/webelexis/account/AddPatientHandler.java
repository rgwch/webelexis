/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.account;

import static ch.webelexis.Cleaner.ELEXISDATE;
import static ch.webelexis.Cleaner.MAIL;
import static ch.webelexis.Cleaner.NAME;
import static ch.webelexis.Cleaner.PHONE;
import static ch.webelexis.Cleaner.TEXT;
import static ch.webelexis.Cleaner.ZIP;

import java.util.UUID;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;

/**
 * Add a new Account for an existing patient or a new patient and a new account
 * 
 * @author gerry
 *
 */
public class AddPatientHandler implements Handler<Message<JsonObject>> {
	Verticle server;
	JsonObject cfg;
	Logger log;
	EventBus eb;
	UserDetailHandler udh;
	private String[] fields = { "id", "Bezeichnung1", "Bezeichnung2", "Geburtsdatum", "Strasse", "Plz", "Ort",
			"Telefon1", "NatelNr", "Email", "Bemerkung", "istPatient" };

	public AddPatientHandler(Verticle server, JsonObject cfg) {
		this.server = server;
		this.cfg = cfg;
		log = server.getContainer().logger();
		eb = server.getVertx().eventBus();
		udh = new UserDetailHandler(server);
	}

	@Override
	public void handle(final Message<JsonObject> externalRequest) {
		log.info("add patient: " + externalRequest.body().encodePrettily());
		final Cleaner c = new Cleaner(externalRequest);

		try {
			// check if username exists in webelexis users
			udh.getUser(c.get("username", MAIL, false), new Handler<JsonObject>() {

				public void handle(JsonObject user) {
					if (user != null) {
						log.warn("user exists " + externalRequest.body().getString("username"));
						/* user exists: error */
						c.replyError("user exists");
					} else {
						try {
							/* user does not exist; check if patient exists */
							String sql = "select id from KONTAKT where Bezeichnung1=? and Bezeichnung2=? and Geburtsdatum=? and deleted='0'";
							JsonObject jo = new JsonObject()
									.putString("action", "prepared")
									.putString("statement", sql)
									.putArray(
											"values",
											new JsonArray(new String[] { c.get("name", NAME, false), c.get("vorname", NAME, false),
													c.get("geburtsdatum", ELEXISDATE, false) }));
							eb.send("ch.webelexis.sql", jo, new QueryResultHandler(c));
						} catch (ParametersException pex) {
							log.error(pex.getMessage(), pex);
							c.replyError("parameter error");
						}
					}

				}

			});
		} catch (ParametersException pex) {
			log.error(pex.getMessage(), pex);
			c.replyError("parameter error");
		}
	}

	/**
	 * Called after query if patient exists in Elexis database
	 *
	 */
	class QueryResultHandler implements Handler<Message<JsonObject>> {

		Cleaner c;

		QueryResultHandler(Cleaner externalRequestCleaner) {
			c = externalRequestCleaner;
		}

		@Override
		public void handle(final Message<JsonObject> result) {
			JsonObject rb = result.body();
			log.debug("SQL user answer: " + rb.encodePrettily());
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
						log.debug("creating Elexis user " + pid);
						JsonArray row = new JsonArray().addString(pid).addString(c.get("name", NAME, false))
								.addString(c.get("vorname", NAME, false)).addString(c.get("geburtsdatum", ELEXISDATE, false))
								.addString(c.get("strasse", TEXT, true)).addString(c.get("plz", ZIP, true))
								.addString(c.get("ort", NAME, true)).addString(c.get("telefon", PHONE, true))
								.addString(c.get("mobil", PHONE, true)).addString(c.get("email", MAIL, false))
								.addString("via webelexis").addString("1");
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
				user.putBinary("pwhash", UserDetailHandler.makeHash(user.getString("username"), pwd));
			}
			if (cfg.getBoolean("confirm-mail", false)) {
				user.putBoolean("active", false);
			} else {
				user.putBoolean("active", true);
			}
			udh.putUser(user, new Handler<Boolean>() {
				@Override
				public void handle(Boolean insertOK) {
					if (insertOK) {
						if (cfg.getBoolean("confirm-mail", false)) {
							user.putString("confirmID", UUID.randomUUID().toString());
							final JsonObject mailCfg = cfg.getObject("mailer");
							final JsonObject mail = new JsonObject()
									.putString("to", user.getString("username"))
									.putString(
											"body",
											mailCfg.getString("activation_body")
													.replaceFirst("%activationcode%", user.getString("confirmID")))
									.putString("subject", mailCfg.getString("activation_subject"));
							eb.send("ch.webelexis.mailer", mail, new Handler<Message<JsonObject>>() {

								@Override
								public void handle(Message<JsonObject> mailerReply) {
									if (mailerReply.body().getString("status").equals("ok")) {
										cle.replyOk();
									} else {
										log.error("mailer error: " + mailerReply.body().encodePrettily());
										cle.replyError("mail error.");
									}
								}
							});

						} else { // no confirmation mail
							cle.replyError("could not create user in nosql");
						}

					} else {

					}
				}
			});

		} catch (ParametersException pex) {
			log.error(pex.getMessage(), pex);
			cle.replyError("parameter error");

		}
	}
}