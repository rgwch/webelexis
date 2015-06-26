/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

/**
 * This file is part of webelexis
 * (c) 2015 by G. Weirich
 */
package ch.webelexis.agenda;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;
import ch.webelexis.account.UserDetailHandler;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

import java.util.Date;
import java.util.UUID;

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
                                .putString("action", "prepared")
                                .putString(
                                        "statement",
                                        "INSERT INTO AGNTERMINE (ID,lastupdate,Tag,Bereich,Beginn,Dauer,TerminTyp,TerminStatus,Grund,PatID) VALUES(?,?,?,?,?,?,?,?,?,?)")
                                .putArray(
                                        "values",
                                        new JsonArray(new String[]{UUID.randomUUID().toString(),
                                                Long.toString(new Date().getTime()), day, resource, Integer.toString(time), "30",
                                                apptType, apptState, ip, patMsg.getString("patientid")}));
                        verticle.getVertx().eventBus()
                                .send("ch.webelexis.sql", bridge, new Handler<Message<JsonObject>>() {

                                    @Override
                                    public void handle(Message<JsonObject> event) {
                                        externalEvent.reply(event.body());

                                    }
                                });

                    } else {
                        cl.replyError("not found " + username);
                        verticle.getContainer().logger()
                                .warn(username + " not found. ");
                    }
                }
            });

        } catch (ParametersException pex) {
            verticle.getContainer().logger().error(pex.getMessage(), pex);
            cl.replyError("parameter error");
        }

    }

}
