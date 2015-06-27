/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

/**
 * This file is part of webelexis
 * (c) 2015 by G. Weirich
 */
package ch.webelexis.agenda;

import ch.rgw.vertx.Util;
import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;
import ch.webelexis.account.UserDetailHandler;
import io.vertx.core.AsyncResult;
import io.vertx.core.AsyncResultHandler;
import io.vertx.core.Handler;
import io.vertx.core.Verticle;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;

import java.util.Date;
import java.util.UUID;
import java.util.logging.Logger;

import static ch.webelexis.Cleaner.*;

/**
 * Handler for insert operations in the agenda. Listens to messages to
 * "ch.webelexis.agenda.insert"
 *
 * @author gerry
 */
public class PublicAgendaInsertHandler implements Handler<Message<JsonObject>> {

    JsonObject cfg;
    Verticle verticle;
    Logger log= Logger.getLogger("Public AgendaInsertHandler");

    public PublicAgendaInsertHandler(Verticle v, JsonObject cfg) {
        this.verticle = v;
        this.cfg = cfg;
    }

    /**
     * expected parameter is a Json Object: { day: 'yyyymmdd', time: 'hh:mm',
     * name: 'name, firstname, DOB', ip: 'ip-address'}
     */
    @Override
    public void handle(final Message<JsonObject> externalEvent) {
        final Cleaner cl = new Cleaner(externalEvent);
        final String apptType = cfg.getString("apptType", "normal");
        final String apptState = cfg.getString("apptState", "Via Internet");
        final String resource = cfg.getString("resource", "default");
        try {
            final String day = cl.get("day", ELEXISDATE, false);
            final String username = cl.get("patid", MAIL, false);
            final String[] timeString = cl.get("time", TIME, false).split(":");
            final String ip = cl.get("ip", IP, true);

            new UserDetailHandler(verticle).getUser(username, new Handler<JsonObject>() {

                @Override
                public void handle(JsonObject patMsg) {

                    if (patMsg != null) {
                        int time = Integer.parseInt(timeString[0]) * 60 + Integer.parseInt(timeString[1]);
                        JsonObject bridge = new JsonObject()
                                .put("action", "prepared")
                                .put(
                                  "statement",
                                  "INSERT INTO AGNTERMINE (ID,lastupdate,Tag,Bereich,Beginn,Dauer,TerminTyp,TerminStatus,Grund,PatID) VALUES(?,?,?,?,?,?,?,?,?,?)")
                                .put(
                                        "values",
                                  Util.asJsonArray(new String[]{UUID.randomUUID().toString(),
                                    Long.toString(new Date().getTime()), day, resource, Integer.toString(time), "30",
                                    apptType, apptState, ip, patMsg.getString("patientid")}));
                        verticle.getVertx().eventBus()
                                .send("ch.webelexis.sql", bridge, new AsyncResultHandler<Message<JsonObject>>() {

                                    @Override
                                    public void handle(AsyncResult<Message<JsonObject>> event) {
                                        externalEvent.reply(event.result().body());

                                    }
                                });

                    } else {
                        cl.replyError("not found " + username);
                        log.warning(username + " not found. ");
                    }
                }
            });

        } catch (ParametersException pex) {
            log.severe(pex.getMessage());
            cl.replyError("parameter error");
        }

    }

}
