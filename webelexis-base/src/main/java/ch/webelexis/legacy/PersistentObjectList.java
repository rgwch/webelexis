/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.legacy;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

import ch.webelexis.Cleaner;

public class PersistentObjectList {
	private JsonObject dataType;
	private String foreignKey;
	private String uid;

	public PersistentObjectList(JsonObject dataType, String foreignKey, String uid) {
		this.dataType = dataType;
		this.foreignKey = foreignKey;
		this.uid = uid;
	}

	public void fetchAsync(EventBus eb, final Cleaner request) {
		JsonObject jo = new JsonObject().putString("action", "prepared").putString("statement",
					"SELECT * FROM " + dataType.getString("table") + " WHERE ?=? and deleted='0'").putArray(
					"values", new JsonArray(new String[] { foreignKey, uid }));
		eb.send("ch.webelexis.sql", jo, new Handler<Message<JsonObject>>() {

			@Override
			public void handle(Message<JsonObject> result) {
				JsonObject msg = result.body();
				if (msg.getString("status").equals("ok")) {
					JsonArray ret = new JsonArray();
					JsonArray fields = msg.getArray("fields");
					JsonArray rows = msg.getArray("results");
					for (int i = 0; i < rows.size(); i++) {
						JsonObject obj = new JsonObject().putString("status", "ok");
						JsonArray values = rows.get(i);
						for (int j = 0; j < fields.size(); j++) {
							obj.putValue((String) fields.get(i), values.get(i));
						}
						ret.add(obj);
					}

					request.reply(new JsonObject().putString("status", "ok").putArray("result", ret));

				} else {
					request.replyError(msg.getString("message"));
				}
			}
		});
	}
}
