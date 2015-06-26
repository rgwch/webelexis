/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

package ch.ch.rgw.vertx;

import io.vertx.core.json.JsonArray;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

/**
 * Created by gerry on 26.06.15.
 */
public class Util {
  public static JsonArray asJsonArray(String[] source) {
    ArrayList<String> ret = (ArrayList<String>) Arrays.asList(source);
    return new JsonArray(ret);
  }

  public static JsonArray asJsonArray(Object[] source){
    JsonArray ret=new JsonArray();
    for(Object o:source){
      ret.add(o);
    }
    return ret;
  }

  public static JsonArray asJsonArray(String source) {
    JsonArray ret = new JsonArray().add(source);
    return ret;
  }

  public static Object[] asObjectArray(JsonArray source) {
    return asList(source).toArray();
  }

  public static List<?> asList(JsonArray source) {
    ArrayList<Object> ret = new ArrayList<Object>(source.size());
    Iterator it = source.iterator();
    while (it.hasNext()) {
      Object o = it.next();
      ret.add(o);
    }
    return ret;
  }
}
