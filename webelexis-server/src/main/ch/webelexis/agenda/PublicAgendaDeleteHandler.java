/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.agenda;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;
import ch.webelexis.account.UserDetailHandler;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.logging.Logger;

import static ch.webelexis.Cleaner.*;

public class PublicAgendaDeleteHandler implements Handler<Message<JsonObject>> {
    AbstractVerticle verticle;
    JsonObject cfg;
    Logger log = Logger.getLogger("PublicAgendaDeleteHandler");

    public PublicAgendaDeleteHandler(AbstractVerticle v, JsonObject cfg) {
        this.cfg = cfg;
        verticle = v;
    }

    @Override
    public void handle(Message<JsonObject> externalMsg) {
        final Cleaner cl = new Cleaner(externalMsg);
        try {
            final String username = cl.get("username", MAIL, false);
            final String day = cl.get("day", ELEXISDATE, false);
            final String time = cl.get("time", NUMBER, false);
            new UserDetailHandler(verticle).getUser(username, new Handler<JsonObject>() {

                @Override
                public void handle(JsonObject userMsg) {
                    JsonObject op = new JsonObject()
                            .put("action", "prepared")
                            .put("statement", "UPDATE AGNTERMINE set DELETED=? where PatID=? and Tag=? and Beginn=?")
                            .put("values", new JsonArray(new String[]{"1", userMsg.getString("patientid"), day, time}));
                    log.finest(op.encodePrettily());
                    verticle.getVertx().eventBus().send("ch.webelexis.sql", op, new Handler<Message<JsonObject>>() {

                        @Override
                        public void handle(Message<JsonObject> sqlAnswer) {
                            if (sqlAnswer.body().getString("status").equals("ok")) {
                                cl.replyOk();
                            } else {
                                log.warning(sqlAnswer.body().encodePrettily());
                                cl.replyError("database error SQL");
                            }
                        }
                    });
                }

            });
        } catch (ParametersException e) {
            e.printStackTrace();
            cl.replyError();
        }


    }

}
