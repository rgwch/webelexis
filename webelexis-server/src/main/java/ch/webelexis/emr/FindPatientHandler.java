/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.emr;

import ch.rgw.vertx.Util;
import ch.webelexis.Cleaner;
import ch.webelexis.Mapper;
import ch.webelexis.ParametersException;
import io.vertx.core.AsyncResult;
import io.vertx.core.AsyncResultHandler;
import io.vertx.core.Handler;
import io.vertx.core.Verticle;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.Iterator;
import java.util.logging.Logger;

/**
 * Created by gerry on 14.06.15.
 */
public class FindPatientHandler implements Handler<Message<JsonObject>> {
  Verticle server;
  Logger log = Logger.getLogger("FindPatientHandler");
  EventBus eb;

  final static String[] fields = {"Bezeichnung1", "Bezeichnung2", "Geburtsdatum", "geschlecht", "id", "patientnr", "Strasse", "plz", "Ort", "telefon1", "telefon2", "natelnr", "email", "bemerkung"};
  final static String sql = "SELECT FIELDS from KONTAKT where Bezeichnung1 like ? OR Bezeichnung2 like ? order by Bezeichnung1, Bezeichnung2";

  public FindPatientHandler(Verticle server) {
    this.server = server;
    eb = server.getVertx().eventBus();
  }

  @Override
  public void handle(Message<JsonObject> externalEvent) {
    final Cleaner cl = new Cleaner(externalEvent);
    try {
      String expr = "%" + cl.get("expr", Cleaner.TEXT, false) + "%";
      final Mapper mapper = new Mapper(fields);
      JsonObject jo = new JsonObject().put("action", "prepared").put("statement", mapper.mapToString(sql, "FIELDS"))
        .put("values", Util.asJsonArray(new String[]{expr, expr}));
      log.finest("sending Query " + jo.encode());
      eb.send("ch.webelexis.sql", jo, new AsyncResultHandler<Message<JsonObject>>() {
        @Override
        public void handle(AsyncResult<Message<JsonObject>> response) {
          JsonObject ans = response.result().body();
          if (ans.getString("status").equals("ok")) {
            JsonArray rows = ans.getJsonArray("results");
            Iterator it = rows.iterator();
            JsonArray ret = new JsonArray();
            while (it.hasNext()) {
              JsonArray row = (JsonArray) it.next();
              JsonObject jo = mapper.mapToJson(Util.asObjectArray(row));
              ret.add(jo);
            }
            JsonObject result = new JsonObject().put("status", "ok").put("result", ret);
            cl.reply(result);
          } else {
            cl.replyError(ans.getString("message"));
          }
        }
      });
    } catch (ParametersException pex) {
      cl.replyError(pex.getLocalizedMessage());
    }
  }


}
