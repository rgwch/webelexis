/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

package ch.rgw.vertx;

import io.vertx.core.AsyncResult;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by gerry on 26.06.15.
 */
public class Util {
  public static JsonArray asJsonArray(String[] source) {
    JsonArray ret = new JsonArray();
    for (String s : source) {
      ret.add(s == null ? "" : s);
    }
    return ret;
  }

  public static JsonArray asJsonArray(Object[] source) {
    JsonArray ret = new JsonArray();
    for (Object o : source) {
      ret.add(o);
    }
    return ret;
  }

  public static JsonArray asJsonArray(String source) {
    return new JsonArray().add(source);
  }

  public static Object[] asObjectArray(JsonArray source) {
    return asList(source).toArray();
  }

  public static List<?> asList(JsonArray source) {
    ArrayList<Object> ret = new ArrayList<>(source.size());
    Iterator it = source.iterator();
    while (it.hasNext()) {
      Object o = it.next();
      ret.add(o);
    }
    return ret;
  }

  public static String getParm(String name, AsyncResult<Message<JsonObject>> res) {
    if (res != null) {
      if (res.result() != null) {
        if (res.result().body() != null) {
          return res.result().body().getString(name);
        }
      }
    }
    return null;
  }

  public static String getParm(String name, Message<JsonObject> msg) {
    if (msg!=null){
      if(msg.body()!=null){
        if(msg.body().containsKey(name)){
          return msg.body().getString(name);
        }
      }
    }
    assert msg != null;
    msg.reply(new JsonObject().put("status","error").put("message","parameter error: "+name));
    return "";
  }

  public static JsonObject getObject(String name, Message<JsonObject> msg){
    if (msg!=null){
      if(msg.body()!=null){
        if(msg.body().containsKey(name)){
          return msg.body().getJsonObject(name);
        }
      }
    }
    assert msg != null;
    msg.reply(new JsonObject().put("status","error").put("message","parameter error: "+name));
    return new JsonObject();

  }
  public static void sendError(Message<JsonObject> addr, String message) {
    addr.reply(new JsonObject().put("status", "error").put("message", message));
  }

  public static void sendStatus(Message<JsonObject> addr, String status) {
    addr.reply(new JsonObject().put("status", status));
  }

  public static void sendOK(Message<JsonObject> addr) {
    addr.reply(new JsonObject().put("status", "ok"));
  }

  public static void sendOK(Message<JsonObject> addr, JsonObject result){
    addr.reply(new JsonObject().put("status", "ok").put("result", result));
  }

}
