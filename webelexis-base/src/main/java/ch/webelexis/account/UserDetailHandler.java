/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.account;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

public class UserDetailHandler {
	Verticle verticle;
	EventBus eb;
	Logger log;

	public UserDetailHandler(Verticle v) {
		verticle = v;
		eb = v.getVertx().eventBus();
		log = v.getContainer().logger();
	}

	/**
	 * Get a User from the Mongo-Database.
	 * 
	 * @param id
	 *          User-ID
	 * @param handler
	 *          a Handler<JsonObject> to call with the Result. The result is
	 *          either the User, or null if no such user was found or if an error
	 *          happened (in that case, more Info is in the log)
	 */
	public void getUser(final String id, final Handler<JsonObject> handler) {
		JsonObject query = new JsonObject().putString("action", "findone").putString("collection", "users")
				.putObject("matcher", new JsonObject().putString("username", id));
		eb.send("ch.webelexis.nosql", query, new Handler<Message<JsonObject>>() {

			@Override
			public void handle(Message<JsonObject> answer) {
				// TODO: more checks on completeness and sync with medelexis
				if (answer.body().getString("status").equals("ok")) {
					handler.handle(answer.body().getObject("result"));
				} else {
					log.fatal("severe: could not access nosql server " + answer.body().encodePrettily());
					handler.handle(null);
				}
			}
		});
	}

	public void putUser(final JsonObject user, final Handler<Boolean> handler) {
		JsonObject op = new JsonObject().putString("action", "update").putString("collection", "users")
				.putObject("criteria", new JsonObject().putString("username", user.getString("username")))
				.putObject("objNew", user).putBoolean("upsert", true).putBoolean("multi", false);
		eb.send("ch.webelexis.nosql", op, new Handler<Message<JsonObject>>() {

			@Override
			public void handle(Message<JsonObject> answer) {
				if (answer.body().getString("status").equals("ok")) {
					handler.handle(true);
				} else {
					log.fatal("severe: could not update document on nosql server. " + answer.body().encodePrettily());
					handler.handle(false);
				}
			}

		});
	}

	public static byte[] makeHash(String username, String password) {
		try {

			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(username.getBytes("utf-8"));
			return md.digest(password.getBytes("utf-8"));

		} catch (NoSuchAlgorithmException e) {
			// should not happen
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// should not happen
			e.printStackTrace();
		}
		return null;
	}

}
