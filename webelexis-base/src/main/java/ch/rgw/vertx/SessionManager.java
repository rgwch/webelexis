package ch.rgw.vertx;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.vertx.java.busmods.BusModBase;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.http.HttpClient;
import org.vertx.java.core.http.HttpClientRequest;
import org.vertx.java.core.http.HttpClientResponse;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

import sun.security.provider.MD5;

public class SessionManager extends BusModBase {
	private static final long DEFAULT_TIMEOUT = 10 * 60 * 1000;

	private String basicAddress;
	private String persistorAddress;
	private String usersCollection;
	private Map<String, Session> sessions = new HashMap<String, Session>();

	public void start() {
		super.start();

		basicAddress = getOptionalStringConfig("address", "ch.rgw.sessions");
		persistorAddress = getOptionalStringConfig("persistor_address",
				"ch.rgw.nosql");
		usersCollection = getOptionalStringConfig("users_collection", "users");

		eb.registerHandler(basicAddress + ".create", createHandler);
		eb.registerHandler(basicAddress + ".destroy", destroyHandler);
		eb.registerHandler(basicAddress + ".login", loginHandler);
		eb.registerHandler(basicAddress + ".logout", logoutHandler);
		eb.registerHandler(basicAddress + ".authorize", authorizeHandler);
		eb.registerHandler(basicAddress + ".admin", adminHandler);

	}

	private Handler<Message<JsonObject>> createHandler = new Handler<Message<JsonObject>>() {
		@Override
		public void handle(Message<JsonObject> msg) {
			Session session = new Session();
			sessions.put(session.id, session);
			msg.reply(new JsonObject().putString("sessionID", session.id));
		}
	};
	private Handler<Message<JsonObject>> destroyHandler = new Handler<Message<JsonObject>>() {

		@Override
		public void handle(Message<JsonObject> msg) {
			Session session = checkSession(msg);
			if (session != null) {
				sessions.remove(session.id);
			}

		}
	};
	private Handler<Message<JsonObject>> loginHandler = new Handler<Message<JsonObject>>() {

		@Override
		public void handle(Message<JsonObject> msg) {
			Session session = checkSession(msg);
			if (session != null) {

			}
		}
	};
	private Handler<Message<JsonObject>> logoutHandler = new Handler<Message<JsonObject>>() {

		@Override
		public void handle(Message<JsonObject> msg) {
			Session session = checkSession(msg);
			if (session != null) {
				session.roles = new JsonArray();
				session.username = "";
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
					}
				}
			}

		}

	};

	private JsonObject verifyGoogleId(String id) {
		HttpClient htc = vertx.createHttpClient().setSSL(true)
				.setHost("www.googleapis.com") // ?id_token=XYZ123.)
				.setPort(443).setTrustAll(true);
		htc.getNow("/oauth2/v1/tokeninfo?id_token=" + id,
				new Handler<HttpClientResponse>() {

					@Override
					public void handle(HttpClientResponse arg0) {
						// TODO Auto-generated method stub

					}
				});
		return null;
	}

	
	private Session checkSession(Message<JsonObject> msg) {
		Session session = sessions.get(getMandatoryString("sessionID", msg));
		if (session == null) {
			sendError(msg, "no session");
			return null;
		}
		session.refresh();
		return session;
	}

	private boolean isAuthorized(Session session, String role) {

		if ((role == null) || role.equalsIgnoreCase("guest")) {
			return true;
		}
		JsonArray givenRoles = session.roles;
		if (givenRoles.contains(role)) {
			return true;
		}
		return false;
	}
	
	private void addUser(Message<JsonObject> msg){
		JsonObject user=getMandatoryObject("user", msg);
		if(user!=null){
			JsonObject dbUser;
		}
	}

	private JsonObject pwhash(String username, String password){
		try {
			MessageDigest md=MessageDigest.getInstance("MD5");
			md.update(username.getBytes("utf-8"));
			byte[] pwbytes=md.digest(password.getBytes("utf-8"));
			return new JsonObject().putBinary("pwdhash", pwbytes).putString("username", username);
	
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
			timerID = vertx.setTimer(
					getOptionalLongConfig("timeout", DEFAULT_TIMEOUT),
					new Handler<Long>() {

						@Override
						public void handle(Long arg0) {
							// TODO Auto-generated method stub

						}
					});
		}

		String id;
		int loginFailures = 0;
		String username = "";
		boolean loggedIn;
		long timerID;
		JsonArray roles = new JsonArray();
	}
}
