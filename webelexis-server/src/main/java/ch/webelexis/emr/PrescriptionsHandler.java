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
import io.vertx.core.json.JsonObject;

import java.util.logging.Logger;

class PrescriptionsHandler implements Handler<Message<JsonObject>> {
  private final Verticle v;
  private final EventBus eb;
  private final Logger log = Logger.getLogger("PrescriptionsHandler");
  static final String J_TABLE = "PATIENT_ARTIKEL_JOINT";
  static final String ART_TABLE = "ARTIKEL";
  private final String[] fields = new String[]{"j.PatientID, j.Artikel, j. RezeptID, j.DateFrom, j.DateUntil, j.Dosis, j.Anzahl, j.Bemerkung, j.ExtInfo"};

  public PrescriptionsHandler(Verticle server) {
    v = server;
    this.eb = v.getVertx().eventBus();
  }

  @Override
  public void handle(Message<JsonObject> externalRequest) {
    Cleaner cl = new Cleaner(externalRequest);
    try {
      log.finest("LabResultSummaryHandler: Handling " + externalRequest.body().encode());
      String patId = cl.get("patid", Cleaner.UID, false);
      Mapper mapper = new Mapper(fields);
      String sql = "SELECT FIELDS FROM PATIENT_ARTIKEL_JOINT WHERE PatientID=? and deleted='0'";

      JsonObject jo = new JsonObject().put("action", "prepared")
        .put("statement", mapper.mapToString(sql, "FIELDS"))
        .put("values", Util.asJsonArray(new String[]{patId}));
      log.finest("sending message :" + jo.encodePrettily());
      eb.send("ch.webelexis.sql", jo, new SqlResult(cl));

    } catch (ParametersException e) {
      e.printStackTrace();
      log.warning("Parameter error " + cl.toString());
      cl.replyError("parameter error");
    }

  }

  class SqlResult implements AsyncResultHandler<Message<JsonObject>> {
    final Cleaner cl;

    SqlResult(Cleaner c) {
      this.cl = c;
    }

    @Override
    public void handle(AsyncResult<Message<JsonObject>> sqlAnswer) {
      log.finest("LabReuslt: Got answer from sql server: " + sqlAnswer.result().body().encodePrettily());
      JsonObject result = sqlAnswer.result().body();
      cl.reply(result);
    }
  }
}
