package ch.rgw.vertx;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.vertx.java.busmods.BusModBase;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

public class SessionManager extends BusModBase {
	private static final long DEFAULT_TIEMOUT = 10 * 60 * 1000;

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
			Session session = sessions
					.get(getMandatoryString("sessionID", msg));
			if (session == null) {
				sendError(msg, "no session");
			} else {
				sessions.remove(session.id);
			}

		}
	};
	private Handler<Message<JsonObject>> loginHandler = new Handler<Message<JsonObject>>() {

		@Override
		public void handle(Message<JsonObject> arg0) {
			// TODO Auto-generated method stub

		}
	};
	private Handler<Message<JsonObject>> logoutHandler = new Handler<Message<JsonObject>>() {

		@Override
		public void handle(Message<JsonObject> msg) {
			Session session = sessions
					.get(getMandatoryString("sessionID", msg));
			if (session == null) {
				sendError(msg, "no session");
			}
			session.roles = new JsonArray();
			session.username = "";
			session.loggedIn = false;
			session.refresh();
			sendOK(msg);
		}
	};
	private Handler<Message<JsonObject>> authorizeHandler = new Handler<Message<JsonObject>>() {

		@Override
		public void handle(Message<JsonObject> msg) {
			Session session = sessions
					.get(getMandatoryString("sessionID", msg));
			if (session == null) {
				sendStatus("no session", msg);
			} else {
				session.refresh();
				String neededRole = getMandatoryString("role", msg);
				if (neededRole == null || neededRole.equalsIgnoreCase("guest")) {
					sendOK(msg);
				} else {
					JsonArray givenRoles = session.roles;
					if (givenRoles.contains(neededRole)) {
						sendOK(msg);
					} else {
						sendStatus("denied", msg);
					}
				}
			}

		}
	};

	private Handler<Message<JsonObject>> adminHandler = new Handler<Message<JsonObject>>() {

		@Override
		public void handle(Message<JsonObject> msg) {
			Session session=sessions.get(getMandatoryString("sessionID", msg));
			if(session==null){
				sendError(msg, "no session");
			}else{
				if(!session.roles.contains("admin")){
					sendStatus("denied",msg);
				}else{
					String cmd=getMandatoryString("command", msg);
					if(cmd=="adduser"){
						addUser(getMandatoryObject("user", msg));
					}
				}
			}
			
		}

		private void addUser(JsonObject user) {
			// TODO Auto-generated method stub
			
		}
	};

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
					getOptionalLongConfig("timeout", DEFAULT_TIEMOUT),
					new Handler<Long>() {

						@Override
						public void handle(Long arg0) {
							// TODO Auto-generated method stub

						}
					});
		}

		String id;
		int loginFailures=0;
		String username="";
		boolean loggedIn;
		long timerID;
		JsonArray roles=new JsonArray();
	}
}
