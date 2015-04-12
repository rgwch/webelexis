/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.patient;

import static ch.webelexis.Cleaner.*;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

import ch.webelexis.Cleaner;

public class AddPatientHandler implements Handler<Message<JsonObject>> {
	Server server;
	JsonObject cfg;

	private String[] fields = { "id", "Bezeichnung1", "Bezeichnung2", "Geburtsdatum", "Strasse", "Plz", "Ort",
			"Telefon1", "NatelNr", "Email", "Bemerkung" };

	public AddPatientHandler(Server server, JsonObject cfg) {
		this.server = server;
		this.cfg = cfg;
	}

	@Override
	public void handle(final Message<JsonObject> externalRequest) {
		server.log().info("add patient: " + externalRequest.body().encodePrettily());
		final Cleaner c = new Cleaner(externalRequest);

		// check if username exists in webelexis users
		JsonObject op = new JsonObject().putString("action", "findone").putString("collection", "users")
				.putObject("matcher", new JsonObject().putString("username", c.get("username", MAIL)));
		server.eb().send("ch.webelexis.nosql", op, new Handler<Message<JsonObject>>() {

			@Override
			public void handle(final Message<JsonObject> mongoRequest) {
				if (mongoRequest.body().getString("status").equals("ok")) {
					if (mongoRequest.body().getObject("result") != null) {
						/* user exists: error */
						c.replyStatus("user exists");
					} else {
						/* user does not exist; check if patient exists */
						String sql = "select id from KONTAKT where Bezeichnung1=? and Bezeichnung2=? and Geburtsdatum=?";
						JsonObject jo = new JsonObject()
								.putString("action", "prepared")
								.putString("statement", sql)
								.putArray(
										"values",
										new JsonArray(new String[] { c.get("name", NAME), c.get("vorname", NAME),
												c.get("geburtsdatum", ELEXISDATE) }));
						server.eb().send("ch.webelexis.sql", jo, new QueryResultHandler(c));
					}
				} else {
					c.replyError("mongo database failure");
				}
			}
		});
	}

	class QueryResultHandler implements Handler<Message<JsonObject>> {

		Cleaner c;

		QueryResultHandler(Cleaner externalRequestCleaner) {
			c = externalRequestCleaner;
		}

		@Override
		public void handle(final Message<JsonObject> result) {
			JsonObject rb = result.body();
			if (rb.getString("status").equals("ok")) {
				if (rb.getArray("results").size() > 0) {
					/* Patient exists, just create user */
					final String pid = rb.getArray("results").get(0);
					addUser(c, pid);
				} else {
					/* create Patient and user */
					String pid = UUID.randomUUID().toString();
					JsonArray row = new JsonArray().addString(pid).addString(c.get("name", NAME))
							.addString(c.get("vorname", NAME)).addString(c.get("geburtsdatum", ELEXISDATE))
							.addString(c.get("strasse", NAME)).addString(c.get("plz", ZIP)).addString(c.get("ort", NAME))
							.addString(c.get("telefon", PHONE)).addString(c.get("mobil", PHONE)).addString(c.get("email", MAIL))
							.addString("via webelexis");
					JsonArray values=new JsonArray().add(row);
					JsonObject sql = new JsonObject().putString("action", "insert").putString("table", "KONTAKT")
							.putArray("fields", new JsonArray(fields)).putArray("values", values);
					server.eb().send("ch.webelexis.sql", sql, new SqlResultHandler(c, pid));

				}
			} else {
				server.log().error(rb.getString("status") + " " + rb.getString("message"));
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
				server.log().error(result.body().encodePrettily());
				c.replyError();
			}

		}
	}

	void addUser(final Cleaner cle, final String pid) {
		server.log().debug("mongo insert: "+cle.toString());
		JsonObject user = new JsonObject().putString("username", cle.get("username", MAIL));
		user.putArray("roles", new JsonArray().addString(cfg.getString("defaultRole")));

		String pwd = cle.getOptional("password", null);
		if (pwd != null) {
			user.putBinary("pwhash", makeHash(user.getString("username"), pwd));
		}

		JsonObject op = new JsonObject().putString("action", "save").putString("collection", "users")
				.putObject("document", user);
		server.log().debug("inserting object: "+op.encodePrettily());
		server.eb().send("ch.webelexis.nosql", op, new Handler<Message<JsonObject>>() {

			@Override
			public void handle(Message<JsonObject> reply) {
				cle.reply(reply.body());
			}
		});
	}

	private byte[] makeHash(String username, String password) {
		try {

			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(username.getBytes("utf-8"));
			return md.digest(password.getBytes("utf-8"));

		} catch (NoSuchAlgorithmException e) {
			server.log().fatal("could not create password hash MD5", e);
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			server.log().fatal("don't know how to handle utf-8", e);
			e.printStackTrace();
		}
		return null;
	}
}