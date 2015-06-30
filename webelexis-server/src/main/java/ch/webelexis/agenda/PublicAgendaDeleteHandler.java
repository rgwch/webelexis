/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.agenda;

import ch.rgw.vertx.Util;
import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;
import ch.webelexis.account.UserDetailHandler;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.AsyncResult;
import io.vertx.core.AsyncResultHandler;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;

import java.util.logging.Logger;

import static ch.webelexis.Cleaner.*;

class PublicAgendaDeleteHandler implements Handler<Message<JsonObject>> {
  private final AbstractVerticle verticle;
  private final Logger log = Logger.getLogger("PublicAgendaDeleteHandler");

  public PublicAgendaDeleteHandler(AbstractVerticle v, JsonObject cfg) {
    verticle = v;
  }

  @Override
  public void handle(Message<JsonObject> externalMsg) {
    final Cleaner cl = new Cleaner(externalMsg);
    try {
      final String username = cl.get("username", MAIL, false);
      final String day = cl.get("day", ELEXISDATE, false);
      final String time = cl.get("time", NUMBER, false);
      new UserDetailHandler(verticle).getUser(username, userMsg -> {
        JsonObject op = new JsonObject()
          .put("action", "prepared")
          .put("statement", "UPDATE AGNTERMINE set DELETED=? where PatID=? and Tag=? and Beginn=?")
          .put("values", Util.asJsonArray(new String[]{"1", userMsg.getString("patientid"), day, time}));
        log.finest(op.encodePrettily());
        verticle.getVertx().eventBus().send("ch.webelexis.sql", op, new AsyncResultHandler<Message<JsonObject>>() {

          @Override
          public void handle(AsyncResult<Message<JsonObject>> sqlAnswer) {
            if (sqlAnswer.result().body().getString("status").equals("ok")) {
              cl.replyOk();
            } else {
              log.warning(sqlAnswer.result().body().encodePrettily());
              cl.replyError("database error SQL");
            }
          }
        });
      });
    } catch (ParametersException e) {
      e.printStackTrace();
      cl.replyError();
    }


  }

}
