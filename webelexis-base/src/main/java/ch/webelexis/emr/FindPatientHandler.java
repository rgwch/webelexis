/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.emr;

import ch.webelexis.Cleaner;
import ch.webelexis.Mapper;
import ch.webelexis.ParametersException;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import java.util.Iterator;

/**
 * Created by gerry on 14.06.15.
 */
public class FindPatientHandler implements Handler<Message<JsonObject>> {
    Verticle server;
    Logger log;
    EventBus eb;

    final static String[] fields = {"Bezeichnung1", "Bezeichnung2", "Geburtsdatum", "geschlecht", "id", "patientnr", "Strasse", "plz", "Ort", "telefon1", "telefon2", "natelnr", "email", "bemerkung"};
    final static String sql = "SELECT FIELDS from KONTAKT where Bezeichnung1 like ? OR Bezeichnung2 like ? order by Bezeichnung1, Bezeichnung2";
    public FindPatientHandler(Verticle server) {
        this.server = server;
        log = server.getContainer().logger();
        eb = server.getVertx().eventBus();
    }

    @Override
    public void handle(Message<JsonObject> externalEvent) {
        final Cleaner cl = new Cleaner(externalEvent);
        try {
            String expr = "%" + cl.get("expr", Cleaner.TEXT, false) + "%";
            final Mapper mapper = new Mapper(fields);
            JsonObject jo = new JsonObject().putString("action", "prepared").putString("statement", mapper.mapToString(sql, "FIELDS"))
                    .putArray("values", new JsonArray(new String[]{expr, expr}));
            log.debug("sending Query " + jo.encode());
            eb.send("ch.webelexis.sql", jo, new Handler<Message<JsonObject>>() {
                @Override
                public void handle(Message<JsonObject> response) {
                    JsonObject ans = response.body();
                    if (ans.getString("status").equals("ok")) {
                        JsonArray rows = ans.getArray("results");
                        Iterator it = rows.iterator();
                        JsonArray ret = new JsonArray();
                        while (it.hasNext()) {
                            JsonArray row = (JsonArray) it.next();
                            JsonObject jo = mapper.mapToJson(row.toArray());
                            ret.add(jo);
                        }
                        JsonObject result = new JsonObject().putString("status", "ok").putArray("result", ret);
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
