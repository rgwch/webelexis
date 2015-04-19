package ch.webelexis.emr;

import java.util.HashMap;
import java.util.Map;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

public class LabResult {
	private static Map<String, Map<String, String>> labItems = new HashMap<String, Map<String, String>>();

	String Datum;
	String value;
	String comment;
	String shortname;
	String title;
	String ref;

	JsonObject cnt = new JsonObject();
	Map<String, String> item;
	Handler<Message<JsonObject>> future;
	String itemId;

	public LabResult(JsonArray fields) {
		cnt.putString("datum", fields.get(0)).putString("value", fields.get(2)).putString("comment", fields.get(3));
		itemId = fields.get(1);
		item = labItems.get(itemId);

		if (item == null) {
			item = new HashMap<String, String>();
			JsonObject jo = new JsonObject().putString("action", "prepared")
					.putString("statement", "SELECT kuerzel,titel,Gruppe,prio,RefMann,RefFrauOrTx FROM LABORITEMS where id=?")
					.putArray("values", new JsonArray(new String[] { itemId }));
			future = new LabItemhandler();
			Server.instance.getVertx().eventBus().send("ch.webelexis.sql", jo, future);

		}
	}

	private String getSafe(Map<String, String> m, String field) {
		String raw = m.get(field);
		if (raw == null) {
			return "";
		} else {
			return raw;
		}
	}

	public JsonObject get() {

		if (item == null) {
			JsonObject reply = null; //future.getIfOk(100); // wait at most 100ms
			if (reply != null) {
				JsonArray ival = reply.getArray("results");
				item.put("shortname", ival.get(0));
				item.put("name", ival.get(1));
				item.put("group", ival.get(2));
				item.put("prio", ival.get(3));
				item.put("refM", ival.get(4));
				item.put("refF", ival.get(5));
				labItems.put(itemId, item);
			}
		}
		cnt.putString("shortname", getSafe(item, "shortname"));
		cnt.putString("name", getSafe(item, "name"));
		cnt.putString("group", getSafe(item, "group"));
		cnt.putString("prio", getSafe(item, "prio"));
		cnt.putString("refM", getSafe(item, "refM"));
		cnt.putString("refF", getSafe(item, "refF"));
		return cnt;
	}

	class LabItemhandler implements Handler<Message<JsonObject>> {

		@Override
		public void handle(Message<JsonObject> arg0) {
			// TODO Auto-generated method stub

		}

	}
}
