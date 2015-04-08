/**
 * This file is part of Webelexis
 * (c) 2015 by G. Weirich
 */
package ch.webelexis;

import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

/**
 * Simple helper to return cleaned String entries from a JsonObject (return ""
 * for null and make sure, the result matches a given pattern)
 * 
 * @author gerry
 * 
 */
public class Cleaner {
	public static final String ELEXISDATE = "20[0-9]{6,6}";
	public static final String NAME = "[0-9a-zA-Z \\.-]+";
	public static final String WORD = "[a-zA-Z]+";
	public static final String NOTEMPTY =".+";

	Message<JsonObject> jo;

	public Cleaner(Message<JsonObject> raw) {
		jo = raw;
	}

	public String get(String field, String pattern) {
		String raw = jo.body().getString(field);
		if ((raw != null) && raw.matches(pattern)) {
			return raw;
		} else {
			jo.reply(new JsonObject().putString("status", "bad or missing field value for " + field));
			return "";
		}
	}

	public String getOptional(String field, String pattern, String defaultValue) {
		String raw = jo.body().getString(field);
		if ((raw != null) && raw.matches(pattern)) {
			return raw;
		} else {
			return defaultValue;
		}
}

	public JsonArray getArray(String name, JsonArray defaultValue){
		JsonArray ret=jo.body().getArray(name);
		return ret== null ? defaultValue : ret;
	}
}
