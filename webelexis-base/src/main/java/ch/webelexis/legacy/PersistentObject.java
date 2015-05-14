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


public class PersistentObject {
	String uid;
	JsonObject objType;

	public PersistentObject(JsonObject objType, String uid) {
		this.uid = uid;
		this.objType = objType;
	}

	public void fetchAsync(EventBus eb, final Cleaner request) {
		JsonObject jo = new JsonObject().putString("action", "prepared")
				.putString("statement", "SELECT * FROM " + objType.getString("table") + " where id=? and deleted='0'")
				.putArray("values", new JsonArray(new String[] { "uid" }));
		eb.send("ch.webelexis.sql", jo, new Handler<Message<JsonObject>>() {
			@Override
			public void handle(Message<JsonObject> sqlAnswer) {
				JsonObject msg=sqlAnswer.body();
				if(msg.getString("status").equals("ok")){
					JsonObject ret=new JsonObject().putString("status", "ok");
					JsonArray fields=msg.getArray("fields");
					JsonArray values=msg.getArray("results").get(0);
					for(int i=0;i<fields.size();i++){
						ret.putValue((String)fields.get(i), values.get(i));
					}
					request.reply(ret);
				}else{
					request.replyError(msg.getString("message"));
				}
				
			}
		});
	}
}
