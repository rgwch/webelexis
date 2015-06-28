/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis;

/**
 * Helper class to create Strings from String arrays (similar to the String#join method in Java 8), and to create JsonObjects from
 * SQL answers.
 */

import io.vertx.core.json.JsonObject;

public class Mapper {
  String[] fields;

  public Mapper(String[] fields) {
    this.fields = fields;
  }

  public String mapToString(String input, String placement) {
    StringBuilder sb = new StringBuilder();
    for (String f : fields) {
      sb.append(f).append(",");
    }
    sb.replace(sb.length() - 1, sb.length(), " ");
    return input.replaceFirst(placement, sb.toString());
  }

  public JsonObject mapToJson(Object[] values) {
    JsonObject ret = new JsonObject();
    for (int i = 0; i < fields.length; i++) {
      String field = fields[i];
      int pt = field.indexOf('.');
      if (pt != -1) {
        field = field.substring(pt + 1);
      }
      ret.put(field, values[i]);
    }
    return ret;
  }
}
