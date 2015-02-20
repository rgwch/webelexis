package ch.webelexis.agenda;

import org.vertx.java.core.json.JsonObject;

public class Cleaner {
	JsonObject jo;
	
	public Cleaner(JsonObject raw){
		jo=raw;
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
