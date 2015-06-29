/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

/**
 * This file is part of Webelexis
 * (c) 2015 by G. Weirich
 */

package ch.webelexis.agenda;

import ch.rgw.vertx.Util;
import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.AsyncResult;
import io.vertx.core.AsyncResultHandler;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.*;
import java.util.logging.Logger;

import static ch.webelexis.Cleaner.ELEXISDATE;

/**
 * A handler for list requests to the agenda. Since we won't allow random access
 * to the database, we translate external requests to internal messages here.
 *
 * @author gerry
 */
public class PublicAgendaListHandler implements Handler<Message<JsonObject>> {
  EventBus eb;
  static final int FLD_DAY = 0;
  static final int FLD_BEGIN = 1;
  static final int FLD_DURATION = 2;
  static final int FLD_TYPE = 3;
  static final int FLD_PATIENT_ID = 4;
  Logger log = Logger.getLogger("PublicAgendaListHandler");
  JsonObject cfg;

  public PublicAgendaListHandler(AbstractVerticle v, JsonObject cfg) {
    this.eb = v.getVertx().eventBus();
    this.cfg = cfg;
  }

  /*
   * this is, what mod_mysql expects { "action" : "prepared", "statement" :
   * "SELECT * FROM some_test WHERE name=? AND money > ?", "values" :
   * ["Mr. Test", 15] }
   *
   * and this is, what we expect from the client: { "begin": "yyyymmdd", "end":
   * "yyyymmdd", "token": auth-token }
   */
  @Override
  public void handle(final Message<JsonObject> externalRequest) {
    Cleaner cl = new Cleaner(externalRequest);
    log.finest("public agenda handler " + externalRequest.body().encodePrettily());

    final String resource = cfg.getString("resource") == null ? "" : cfg.getString("resource");
    try {
      JsonObject bridge = new JsonObject()
        .put("action", "prepared")
        .put("statement",
          "SELECT Tag,Beginn,Dauer, TerminTyp, PatID from AGNTERMINE where Tag>=? and Tag <=? and Bereich=? and deleted='0'")
        .put(
          "values",
          Util.asJsonArray(new String[]{cl.get("begin", ELEXISDATE, false), cl.get("begin", ELEXISDATE, false),
            resource}));
      log.finest("sending message: " + bridge.encodePrettily());
      eb.send("ch.webelexis.sql", bridge, new AsyncResultHandler<Message<JsonObject>>() {

        @Override
        public void handle(AsyncResult<Message<JsonObject>> returnvalue) {
          if (returnvalue.succeeded()) {
            JsonObject res = returnvalue.result().body();
            if (res.getString("status").equals("ok")) {

              JsonObject ret = fillBlanks(res.getJsonArray("results"), externalRequest.body().getJsonObject("authorized_user"));
              externalRequest.reply(ret);

            } else {
              System.out.println(Json.encodePrettily(res));
              externalRequest.reply(new JsonObject().put("status", "failure"));
            }

          } else {
            externalRequest.reply(new JsonObject().put("status","error").put("message","internal server error"));
          }
        }
      });
    } catch (ParametersException pex) {
      log.severe(pex.getMessage());
      cl.replyError("parameter error");
    }
  }

  /*
   * fill empty periods of time with "free" appointments
   *
   * @param set
   */
  private JsonObject fillBlanks(JsonArray appointments, JsonObject user) {
    TreeSet<JsonArray> orderedList = new TreeSet<JsonArray>(new Comparator<JsonArray>() {
      @Override
      public int compare(JsonArray o1, JsonArray o2) {
        String day1 = o1.getString(FLD_DAY);
        String day2 = o2.getString(FLD_DAY);
        if (day1.equals(day2)) {
          int start1 = Integer.parseInt(o1.getString(FLD_BEGIN).trim());
          int start2 = Integer.parseInt(o2.getString(FLD_BEGIN).trim());
          return start1 - start2;
        }
        return day1.compareTo(day2);
      }
    });

    String userid = "-";
    if (user != null) {
      userid = user.getString("patientid", "-");
    }
    log.finest("user id:" + userid);
    for (Object li : appointments) {
      @SuppressWarnings("unchecked")
      JsonArray line = (JsonArray) li;
      orderedList.add(line);
    }

    int endTime = 0;
    Iterator<JsonArray> lines = orderedList.iterator();
    JsonArray arr = new JsonArray();
    int slot = 30;
    if (cfg != null) {
      slot = cfg.getInteger("timeSlot") == null ? 30 : cfg.getInteger("timeSlot");

    }

    // Fill in "available" spaces between appointments. Avalailables have
    // the length "slot" as defined in the config
    while (lines.hasNext()) {
      JsonArray aNext = lines.next();
      int startTime = Integer.parseInt(aNext.getString(FLD_BEGIN).trim());
      while ((startTime - endTime) >= slot) {
        String[] free = new String[aNext.size()];
        free[FLD_DAY] = aNext.getString(FLD_DAY);
        free[FLD_BEGIN] = Integer.toString(endTime);
        free[FLD_DURATION] = Integer.toString(slot); // slotInteger.toString(startTime
        // - endTime);
        free[FLD_TYPE] = "available";
        arr.add(Util.asJsonArray(free));
        endTime += slot;
        // System.out.println("created "+free[FLD_BEGIN]+","+free[FLD_DURATION]);
      }
      if ((startTime - endTime) > 0) {
        String[] shorttime = new String[aNext.size()];
        shorttime[FLD_DAY] = aNext.getString(FLD_DAY);
        shorttime[FLD_BEGIN] = Integer.toString(endTime);
        shorttime[FLD_DURATION] = Integer.toString(startTime - endTime);
        shorttime[FLD_TYPE] = "occupied";
        // System.out.println("rest "+free[FLD_BEGIN]+","+free[FLD_DURATION]);
        arr.add(Util.asJsonArray(shorttime));
      }
      endTime = startTime + Integer.parseInt(aNext.getString(FLD_DURATION).trim());
      Object[] line = Util.asObjectArray(aNext);
      if ((line[FLD_PATIENT_ID] != null) && (line[FLD_PATIENT_ID].equals(userid))) {
        line[FLD_PATIENT_ID] = "Ihr Termin: " + user.getString("username");
        line[FLD_TYPE] = "user";
      } else {
        line[FLD_PATIENT_ID] = "";
        line[FLD_TYPE] = "occupied";
      }
      arr.add(Util.asJsonArray(line));
    }

    JsonObject ores = new JsonObject().put("status", "ok").put("type", "basic")
      .put("appointments", arr);
    return ores;

  }

}
