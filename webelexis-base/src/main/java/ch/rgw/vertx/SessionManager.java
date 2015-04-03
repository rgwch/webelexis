package ch.rgw.vertx;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.vertx.java.busmods.BusModBase;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.http.HttpClient;
import org.vertx.java.core.http.HttpClientResponse;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

public class SessionManager extends BusModBase {
	private static final long DEFAULT_TIMEOUT = 10 * 60 * 1000;

	private String basicAddress;
	private String persistorAddress;
	private String usersCollection;
	private Map<String, Session> sessions = new HashMap<String, Session>();

	public void start() {
		super.start();

		basicAddress = getOptionalStringConfig("address", "ch.rgw.sessions");
		persistorAddress = getOptionalStringConfig("persistor_address", "ch.rgw.nosql");
		usersCollection = getOptionalStringConfig("users_collection", "users");

		eb.registerHandler(basicAddress + ".create", createHandler);
		eb.registerHandler(basicAddress + ".destroy", destroyHandler);
		eb.registerHandler(basicAddress + ".login", loginHandler);
		eb.registerHandler(basicAddress + ".logout", logoutHandler);
		eb.registerHandler(basicAddress + ".authorize", authorizeHandler);
		eb.registerHandler(basicAddress + ".admin", adminHandler);

	}

	/**
	 * create a new Session
	 */
	private Handler<Message<JsonObject>> createHandler = new Handler<Message<JsonObject>>() {
		@Override
		public void handle(Message<JsonObject> msg) {
			Session session = new Session();
			sessions.put(session.id, session);
			msg.reply(new JsonObject().putString("sessionID", session.id).putString("status", "ok"));
		}
	};
	private Handler<Message<JsonObject>> destroyHandler = new Handler<Message<JsonObject>>() {

		@Override
		public void handle(Message<JsonObject> msg) {
			Session session = checkSession(msg);
			if (session != null) {
				sessions.remove(session.id);
				sendOK(msg);
			}else{
				sendStatus("invalid session", msg);
			}

		}
	};
	private Handler<Message<JsonObject>> loginHandler = new Handler<Message<JsonObject>>() {

		@Override
		public void handle(final Message<JsonObject> msg) {
			final Session session = checkSession(msg);
			if (session != null) {
				String username = getMandatoryString("username", msg);
				final String pwd = getMandatoryString("password", msg);
				findUser(username, new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> findResult) {
						if (getMandatoryString("status", findResult).equals("ok")) {
							JsonObject user = findResult.body().getObject("result");
							if (user != null) {
								if (checkPwd(user, pwd)) {
									session.user = user;
									session.loggedIn = true;
									session.roles = user.getArray("roles");
									sendOK(msg);
								} else {
									sendStatus("denied", msg);
								}
							} else {
								sendStatus("user not found", msg);
							}
						} else {
							sendStatus("db error", msg);
						}

					}
				});
			}
		}
	};
	private Handler<Message<JsonObject>> logoutHandler = new Handler<Message<JsonObject>>() {

		@Override
		public void handle(Message<JsonObject> msg) {
			Session session = checkSession(msg);
			if (session != null) {
				session.roles = new JsonArray();
				session.user = null;
				session.loggedIn = false;
				session.refresh();
				sendOK(msg);
			}
		}
	};
	private Handler<Message<JsonObject>> authorizeHandler = new Handler<Message<JsonObject>>() {

		@Override
		public void handle(Message<JsonObject> msg) {
			Session session = checkSession(msg);
			if (session != null) {
				if (isAuthorized(session, getMandatoryString("role", msg))) {
					sendOK(msg);
				} else {
					sendStatus("denied", msg);
				}
			}

		}
	};

	private Handler<Message<JsonObject>> adminHandler = new Handler<Message<JsonObject>>() {

		@Override
		public void handle(Message<JsonObject> msg) {
			Session session = checkSession(msg);
			if (session != null) {
				if (!session.roles.contains("admin")) {
					sendStatus("denied", msg);
				} else {
					String cmd = getMandatoryString("command", msg);
					if (cmd == "adduser") {
						addUser(msg);
					} else if (cmd == "removeuser") {
						removeUser(msg);
					}
				}
			}

		}

	};

	/*
	 * Verify, if an id_token is valid and issued by Google
	 */
	private void verifyGoogleId(String id, Handler<Message<JsonObject>> handler) {
		HttpClient htc = vertx.createHttpClient().setSSL(true).setHost("www.googleapis.com") // ?id_token=XYZ123.)
				.setPort(443).setTrustAll(true);
		htc.getNow("/oauth2/v1/tokeninfo?id_token=" + id, new Handler<HttpClientResponse>() {

			@Override
			public void handle(HttpClientResponse resp) {
				if (resp.statusCode() == 0) {

				}

			}
		});
	}

	/*
	 * check whether a valid session exists and is contained as an argument. if
	 * not, send an error message to the original caller and return null.
	 * Otherwise, refresh the session (i.e. set the expire-timer to its original
	 * value) and return it.
	 */
	private Session checkSession(Message<JsonObject> msg) {
		Session session = sessions.get(getMandatoryString("sessionID", msg));
		if (session == null) {
			sendError(msg, "no session");
			return null;
		}
		session.refresh();
		return session;
	}

	/*
	 * check whether a Session may act as "role". If a session is not logged in,
	 * it may only behave as "guest". If it is logged-in, the rights depend on the
	 * roles of the user the session belongs (If their "roles" field contains a
	 * matching role)
	 */
	private boolean isAuthorized(Session session, String role) {

		if ((role == null) || role.equalsIgnoreCase("guest")) {
			return true;
		}
		JsonArray givenRoles = session.roles;
		if (givenRoles != null && givenRoles.contains(role)) {
			return true;
		}
		return false;
	}

	/*
	 * find an entry for a username in the database
	 */
	private void findUser(String username, Handler<Message<JsonObject>> callback) {
		JsonObject op = new JsonObject().putString("action", "findone").putString("collection", usersCollection)
				.putObject("matcher", new JsonObject().putString("username", username));
		eb.send(persistorAddress, op, callback);
	}

	/*
	 * Add a new user to the database. The user is a JsonObject with the following
	 * minimal contents: username: <unique name> password: <string>
	 * 
	 * The user object may contain optional fields, such as roles: <Array of
	 * Strings>
	 * 
	 * And any additional free fields
	 */
	private void addUser(final Message<JsonObject> msg) {
		final JsonObject user = getMandatoryObject("user", msg);
		if (user != null) {
			findUser(user.getString("username"), new Handler<Message<JsonObject>>() {

				@Override
				public void handle(Message<JsonObject> dbReply) {
					if (getMandatoryString("status", dbReply).equals("ok")) {
						sendError(msg, "user " + user.getString("username") + " already exists");
					} else {
						JsonObject dbUser = makePwd(user);
						if (dbUser != null) {
							JsonArray roles = user.getArray("roles");
							if (roles == null) {
								roles = new JsonArray(new String[] { "user" });
							}
							dbUser.putArray("roles", roles);
							JsonObject op = new JsonObject().putString("action", "save").putString("collection", usersCollection)
									.putObject("document", dbUser);
							eb.send(persistorAddress, op, new Handler<Message<JsonObject>>() {

								@Override
								public void handle(Message<JsonObject> reply) {
									msg.reply(reply);
								}
							});
						} else {
							sendError(msg, "bad request");
						}

					}

				}
			});
		} else {
			sendError(msg, "no user supplied");

		}

	}

	private void removeUser(final Message<JsonObject> msg) {
		JsonObject op = new JsonObject().putString("action", "delete").putString("collection", usersCollection)
				.putObject("matcher", new JsonObject().putString("username", getMandatoryString("username", msg)));
		eb.send(persistorAddress, op);
	}

	/*
	 * convert the supplied password to a hash, so that no cleartext-passworts are
	 * stored in the database .
	 */
	private JsonObject makePwd(JsonObject user) {
		byte[] pwbytes = makeHash(user.getString("username"), user.getString("password"));
		if (pwbytes == null) {
			return null;
		}
		user.removeField("password");
		user.putBinary("pwhash", pwbytes);
		return user;
	}

	/*
	 * Check a cleartext password against a hashed database password
	 */
	private boolean checkPwd(JsonObject user, String pwdToCheck) {
		if (user.getBinary("pwhash") == null) {
			makePwd(user);
			eb.send(persistorAddress, new JsonObject().putString("action", "update").putString("collection", usersCollection)
					.putObject("criteria", new JsonObject().putString("_id", user.getString("_id"))).putObject("objNew", user)
					.putBoolean("upsert", false).putBoolean("multi", false));
		}
		byte[] checkBytes = makeHash(user.getString("username"), pwdToCheck);

		if (Arrays.equals(user.getBinary("pwhash"), checkBytes)) {
			return true;
		}
		return false;
	}

	private byte[] makeHash(String username, String password) {
		try {

			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(username.getBytes("utf-8"));
			return md.digest(password.getBytes("utf-8"));

		} catch (NoSuchAlgorithmException e) {
			container.logger().fatal("could not create password hash MD5", e);
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			container.logger().fatal("don't know how to handle utf-8", e);
			e.printStackTrace();
		}
		return null;
	}

	private class Session {
		Session() {
			id = UUID.randomUUID().toString();
			refresh();
		}

		void refresh() {
			if (timerID != 0L) {
				vertx.cancelTimer(timerID);
			}
			timerID = vertx.setTimer(getOptionalLongConfig("timeout", DEFAULT_TIMEOUT), new Handler<Long>() {

				@Override
				public void handle(Long arg0) {
					// TODO Auto-generated method stub

				}
			});
		}

		String id;
		int loginFailures = 0;
		JsonObject user = null;
		boolean loggedIn;
		long timerID;
		JsonArray roles = new JsonArray();
	}
}
