package ch.webelexis.agenda;

import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

public class DBAccess extends Verticle {
	JsonObject config;
	EventBus eb;
	static JdbcLink j;

	@Override
	public void start() {
		eb = vertx.eventBus();
		config = container.config();
		config.putString("dbConnect", System.getProperty("dbConnect"));
		config.putString("dbDriver", "com.mysql.jdbc.Driver");
		config.putString("dbUser",System.getProperty("dbUser"));
		config.putString("dbPwd", System.getProperty("dbPwd"));
		try {
			j = new JdbcLink(config);
			Handler<Message<JsonObject>> handler = new Handler<Message<JsonObject>>() {

				@Override
				public void handle(Message<JsonObject> event) {
					String from = event.body().getString("begin");
					String until = event.body().getString("end");
					String resource = event.body().getString("resource");
					JsonArray result=getAppointments(from, until, resource);
					event.reply(result);
				}

			};
			eb.registerHandler("ch.webelexis.agenda.appointments", handler);

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

		}
	}

	public JsonArray getAppointments(String fromDay,
			String untilDay, String resource) {
		PreparedStatement ps = j
				.prepareStatement("Select * FROM AGNTERMINE Where Tag>=? and Tag<= ? and Bereich=?");
		try {
			ps.setString(1, fromDay);
			ps.setString(2, untilDay);
			ps.setString(3, resource);
			JsonArray ret=new JsonArray();
			if (j.query(ps, ret)) {
				return ret;
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

}
