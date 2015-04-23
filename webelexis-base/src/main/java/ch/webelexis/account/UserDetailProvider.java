/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.account;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

public class UserDetailProvider {
	Verticle verticle;

	public UserDetailProvider(Verticle v) {
		verticle = v;
	}

	public void getUser(final String id, final Handler<JsonObject> handler) {
		JsonObject query = new JsonObject().putString("action", "findone").putString("collection", "users")
				.putObject("matcher", new JsonObject().putString("username", id));
		verticle.getVertx().eventBus().send("ch.webelexis.nosql", query, new Handler<Message<JsonObject>>() {

			@Override
			public void handle(Message<JsonObject> answer) {
				// TODO: more checks on completeness and sync with medelexis
				if(answer.body().getString("status").equals("ok")){
					handler.handle(answer.body().getObject("result"));
				}else{
					verticle.getContainer().logger().fatal("severe: could not access nosql server "+answer.body().encodePrettily());
					handler.handle(null);
				}
			}
		});
	}
	
}
