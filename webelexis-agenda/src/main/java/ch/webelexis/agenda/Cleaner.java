/**
 * This file is part of Webelexis
 * (c) 2015 by G. Weirich
 */
package ch.webelexis.agenda;

import org.vertx.java.core.json.JsonObject;

/**
 * Simple helper to return cleaned String entries from a JsonObject (return ""
 * for null and make sure, the result matches a given pattern)
 * 
 * @author gerry
 * 
 */
public class Cleaner {
	JsonObject jo;

	public Cleaner(JsonObject raw) {
		jo = raw;
	}

	public String get(String field, String pattern) {
		String raw = jo.getString(field);
		if ((raw != null) && raw.matches(pattern)) {
			return raw;
		} else {
			return "";
		}
	}

}
