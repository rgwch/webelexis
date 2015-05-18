/**
 * This file is part of Webelexis
 * (c) 2015 by G. Weirich
 */
package ch.webelexis;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.DecodeException;
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
	// /^\d{1,2}\.\d{1,2}\.(?:\d{4}|\d{2})$/
	public static final String ELEXISDATE = "[12][09][0-9]{6,6}";
	public static final String NAME = "[0-9a-zA-ZäöüÄÖÜéàèß \\.-]+";
	public static final String WORD = "[a-zA-ZäöüÄÖÜéàèß]+";
	public static final String NOTEMPTY = ".+";
	public static final String DATE = "[0-3]?[0-9]\\.[01]?[0-9]\\.[0-9]{2,4}";
	public static final String PHONE = "\\+?[0-9  -/]{7,20}";
	public static final String MAIL = ".+@[a-zA-Z_0-9\\.]*[a-zA-Z_0-9]{2,}\\.[a-zA-Z]{2,3}";
	public static final String TIME = "[0-2][0-9]:[0-5][0-9]";
	public static final String TEXT = "[^%\\*;:]+";
	public static final String URL = "https?://[a-zA-Z0-9-_]+(\\.[a-zA-Z0-9-_]+)*(:[0-9]+)?";
	public static final String IP = "[0-2]?[0-9]?[0-9]\\.[0-2]?[0-9]?[0-9]\\.[0-2]?[0-9]?[0-9]\\.[0-2]?[0-9]?[0-9]";
	public static final String ZIP = "[A-Za-z 0-9]{4,8}";
	public static final String UID = "[a-zA-Z0-9][a-fA-F0-9-]{8,}";
	public static final String NUMBER = "[0-9]+";

	Message<JsonObject> jo;

	public Cleaner(Message<JsonObject> raw) {
		jo = raw;
	}

	/**
	 * get a required integer value
	 * 
	 * @param field
	 *          field to get
	 * @param min
	 *          minimum accepted value
	 * @param max
	 *          maximum accepted value
	 * @return the integer from the field "field"
	 * @throws ParametersException
	 *           if "field" was not set, or if the value was not between (not
	 *           including) min and max.
	 */
	public int getInt(String field, int min, int max) throws ParametersException {
		if (!jo.body().containsField(field)) {
			throw new ParametersException("field " + field + " was not set.");
		} else {
			int val = jo.body().getInteger(field);
			if (val < min || val > max) {
				throw new ParametersException("field value out of range");
			} else {
				return val;
			}
		}
	}

	/**
	 * Get a String value
	 * 
	 * @param field
	 *          field to get
	 * @param pattern
	 *          regexp-Pattern the String must match
	 * @param emptyok
	 *          if true: missing field is acceptable
	 * @return
	 * @throws ParametersException
	 *           if the value is not set and emptyok was false, or if the value
	 *           was set but did nor match the pattern.
	 */
	public String get(String field, String pattern, boolean emptyok) throws ParametersException {
		String raw = jo.body().getString(field);
		if (raw == null || raw.length() == 0) {
			if (emptyok) {
				return raw;
			} else {
				throw new ParametersException("field " + field + " was not set.");
			}
		}
		if ((raw != null) && raw.matches(pattern)) {
			return raw;
		} else {
			jo.reply(new JsonObject().putString("status", "bad or missing field value for " + field));
			throw new ParametersException("value of " + field + " does not match expected criteria");
		}
	}

	/**
	 * Get an optional String field without checks
	 * 
	 * @param field
	 *          field to get
	 * @param defaultValue
	 *          value to return if the field is nor set
	 * @return the requested field
	 */
	public String getOptional(String field, String defaultValue) {
		String raw = jo.body().getString(field);
		if (raw != null) {
			return raw;
		} else {
			return defaultValue;
		}
	}

	/**
	 * Get an optional Array without checks
	 * 
	 * @param name
	 *          name of the field to get
	 * @param defaultValue
	 *          value to return, if the field was not set
	 * @return ClassCastException if the field exists, but is not a JsonArray
	 */
	public JsonArray getArray(String name, JsonArray defaultValue) {
		JsonArray ret = jo.body().getArray(name);
		return ret == null ? defaultValue : ret;
	}

	/**
	 * send a result to the original sender of the message
	 * 
	 * @param result
	 *          an arbitrary object. By convention, a field "status" should exist
	 *          with the value of either "ok" or "error"
	 */
	public void reply(JsonObject result) {
		jo.reply(result);
	}

	/**
	 * send a canned "error" response (message with only one field:
	 * "status":"error")
	 */
	public void replyError() {
		jo.reply(new JsonObject().putString("status", "error"));
	}

	/**
	 * send a custom "error" response
	 * 
	 * @param msg
	 *          a String describing the error. The method sends
	 *          {"status":"error","message":msg}
	 */
	public void replyError(String msg) {
		JsonObject result = new JsonObject().putString("status", "error").putString("message", msg);
		jo.reply(result);
	}

	/**
	 * send a canned "ok" response
	 */
	public void replyOk() {
		jo.reply(new JsonObject().putString("status", "ok"));
	}

	/**
	 * send a custom "ok" response
	 * 
	 * @param msg
	 *          a String to add to the response. The method sends
	 *          {"status":"ok","message":msg}
	 */
	public void replyOk(String msg) {
		JsonObject result = new JsonObject().putString("status", "ok").putString("message", msg);
		jo.reply(result);
	}

	/**
	 * send a custom status message
	 * 
	 * @param msg
	 *          any String describing a status. The method sends {"status":msg}
	 */
	public void replyStatus(String msg) {
		jo.reply(new JsonObject().putString("status", msg));
	}

	/**
	 * generate a String representation of the original message.body() in the
	 * constructor
	 */
	@Override
	public String toString() {
		return jo.body().encodePrettily();
	}

	/**
	 * Create a JsonObject from a file. // Comments are stripped before parsing
	 * 
	 * @param fpath
	 *          filename (with relative or absolute path)
	 * @return a JsonObject created from that file
	 * @throws IOException
	 *           if the file was not found or could not be read
	 * @throws DecodeException
	 *           if the file was not a valid Json Object
	 */
	public static JsonObject createFromFile(String fpath) throws IOException, DecodeException {

		File file = new File(fpath);
		if (!file.exists()) {
			System.out.println(file.getAbsolutePath());
			throw new IOException("File not found " + file.getAbsolutePath());
		}
		char[] buffer = new char[(int) file.length()];
		FileReader fr = new FileReader(file);
		fr.read(buffer);
		fr.close();
		String conf = new String(buffer).replaceAll("//\\s+.+\\r?\\n+\\r?", "");
		JsonObject ret = new JsonObject(conf);
		return ret;
	}

	public static JsonObject createFromStream(InputStream is) throws IOException, DecodeException {
		InputStreamReader ir = new InputStreamReader(is);
		StringBuilder sb = new StringBuilder(10000);
		char[] buffer = new char[1024];
		int chars = 0;
		do {
			chars = ir.read(buffer);
			sb.append(buffer, 0, chars);
		} while (chars == buffer.length);
		ir.close();
		String conf = sb.toString().replaceAll("//\\s+.+\\r?\\n+\\r?", "");
		JsonObject ret = new JsonObject(conf);
		return ret;

	}
}
