/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.emr;

import ch.rgw.vertx.Util;
import ch.rgw.tools.VersionedResource;
import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;
import io.vertx.core.AsyncResult;
import io.vertx.core.AsyncResultHandler;
import io.vertx.core.Handler;
import io.vertx.core.Verticle;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.logging.Logger;


public class ConsultationHandler implements Handler<Message<JsonObject>> {
  Verticle v;
  EventBus eb;
  Logger log = Logger.getLogger("ConsultationHandler");
  String[] fields = new String[]{"k.datum", "k.diagnosen", "k.eintrag"};
  final static String sql = "select k.id, k.datum, k.diagnosen, k.eintrag from BEHANDLUNGEN as k, FAELLE as f, KONTAKT as ko where ko.id=? and f.patientid=ko.id and k.fallid=f.id and k.deleted='0' order by k.datum DESC";

  public ConsultationHandler(Verticle server) {
    v = server;
    this.eb = v.getVertx().eventBus();

  }

  @Override
  public void handle(Message<JsonObject> externalRequest) {
    Cleaner cl = new Cleaner(externalRequest);
    try {
      final String action = cl.get("action", Cleaner.WORD, false);
      if (action.equals("list")) {
        final String patid = cl.get("patid", Cleaner.UID, false);
        JsonObject jo = new JsonObject().put("action", "prepared").put("statement", sql)
          .put("values", Util.asJsonArray(new String[]{patid}));
        log.finest("sending query " + jo.encodePrettily());
        eb.send("ch.webelexis.sql", jo, new GetListResult(cl));
      } else if (action.equals("get")) {
        final String consid = cl.get("consid", Cleaner.UID, false);
        JsonObject jo = new JsonObject().put("action", "prepared")
          .put("statement", "SELECT id,datum,diagnosen,eintrag from BEHANDLUNGEN where id=?")
          .put("values", Util.asJsonArray(new String[]{consid}));
        log.finest("sending query: " + jo.encodePrettily());
        eb.send("ch.webelexis.sql", jo, new GetConsResult(cl));
      }
    } catch (ParametersException pex) {
      log.severe(pex.getMessage());
      cl.replyError(pex.getMessage());
    }
  }

  class GetListResult implements AsyncResultHandler<Message<JsonObject>> {
    Cleaner cl;

    GetListResult(Cleaner c) {
      this.cl = c;
    }

    @Override
    public void handle(AsyncResult<Message<JsonObject>> sqlAnswer) {
      //log.debug("ConsListHandler: Got answer from sql server: " + sqlAnswer.body().encodePrettily());
      JsonObject result = sqlAnswer.result().body();
      if (result.getString("status").equals("ok")) {
        JsonArray rows = result.getJsonArray("results");
        JsonArray ret = new JsonArray();
        for (Object o : rows) {
          JsonObject jk = rowToObject((JsonArray) o);
          if (jk != null) {
            ret.add(jk);
          }
        }
        cl.reply(new JsonObject().put("status", "ok").put("results", ret));
      } else {
        cl.replyError(result.getString("message"));
      }

    }
  }

  private JsonObject rowToObject(JsonArray row) {
    if (row.size() >= 4) {
      JsonObject jk = new JsonObject();
      jk.put("id", row.getString(0));
      jk.put("date", row.getString(1));
      jk.put("diags", row.getString(2));
      byte[] entry = row.getBinary(3);
      if (entry != null) {
        byte[] ba = new byte[entry.length];
        for (int i = 0; i < entry.length; i++) {
          ba[i] = (byte) entry[i];
        }
        VersionedResource vr;
        String ke;
        try {
          vr = VersionedResource.load(ba);
          ke = vr.getHead();
        } catch (Exception e) {
          e.printStackTrace();
          ke = "error reading VersionedResource";
        }
        jk.put("entry", ke);
        return jk;
      }
    }
    return null;
  }

  class GetConsResult implements AsyncResultHandler<Message<JsonObject>> {
    Cleaner cl;

    GetConsResult(Cleaner c) {
      this.cl = c;
    }

    @Override
    public void handle(AsyncResult<Message<JsonObject>> sqlAnswer) {
      //log.debug("ConsResultHandler: Got answer from sql server: " + sqlAnswer.body().encodePrettily());
      JsonObject result = sqlAnswer.result().body();
      if (result.getString("status").equals("ok")) {
        JsonArray rows = result.getJsonArray("results");
        if (rows.size() > 0) {
          JsonObject jk = rowToObject(rows.getJsonArray(0));
          if (jk != null) {
            cl.reply(new JsonObject().put("status", "ok").put("result", jk));
          } else {
            cl.replyError("could not decode result");
          }
        } else {
          cl.replyError("empty result");
        }
      } else {
        cl.replyError(result.getString("message"));
      }
    }
  }
}
