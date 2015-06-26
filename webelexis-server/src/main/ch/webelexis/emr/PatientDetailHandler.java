/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.emr;

import ch.ch.rgw.vertx.Util;
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

import java.util.logging.Logger;

public class PatientDetailHandler implements Handler<Message<JsonObject>> {
    private String tid = "7ba4632caba62c5b3a366";
    private String[] fields = {"k.patientnr", "k.Bezeichnung1", "k.Bezeichnung2", "k.geschlecht", "k.geburtsdatum",
            "k.Strasse", "k.plz", "k.Ort", "k.telefon1", "k.telefon2", "k.natelnr", "k.email", "k.gruppe", "k.bemerkung"};

    Verticle server;
    EventBus eb;
    Logger log=Logger.getLogger("PatientDetailHandler");

    PatientDetailHandler(Verticle s) {
        server = s;
        eb = s.getVertx().eventBus();
    }

    @Override
    public void handle(Message<JsonObject> externalRequest) {
        Cleaner cl = new Cleaner(externalRequest);
        Mapper mapper = new Mapper(fields);
        try {
            String patId = cl.get("patid", Cleaner.NAME, false);
            String sql = mapper.mapToString("SELECT FIELDS from KONTAKT as k where k.id=?", "FIELDS");
            JsonObject jo = new JsonObject().put("action", "prepared").put("statement", sql)
                    .put("values", Util.asJsonArray(new String[]{patId}));
            eb.send("ch.webelexis.sql", jo, new PatDataHandler(externalRequest));
        } catch (ParametersException pex) {
            cl.replyError("parameter error");
        }
    }

    class PatDataHandler implements AsyncResultHandler<Message<JsonObject>> {
        Message<JsonObject> req;

        public PatDataHandler(Message<JsonObject> externalRequest) {
            req = externalRequest;
        }

        @Override
        public void handle(AsyncResult<Message<JsonObject>> patData) {
            JsonObject j = patData.result().body();
            if (j.getString("status").equals("ok")) {
                int rows = j.getInteger("rows");
                JsonArray fields = j.getJsonArray("fields");
                JsonArray results = patData.result().body().getJsonArray("results").getJsonArray(0);
                JsonObject jPat = ArrayToObject(fields, results);
                req.reply(new JsonObject().put("status", "ok").put("patient", jPat));
            } else {
                log.warning(j.getString("status"));
                req.reply(new JsonObject().put("status", "SQL error"));
            }

        }

    }

    JsonObject ArrayToObject(JsonArray fields, JsonArray results) {
        JsonObject ret = new JsonObject();
        for (int i = 0; i < fields.size(); i++) {
            ret.put(((String) fields.getString(i)).toLowerCase(), (String) results.getString(i));
        }
        return ret;
    }
}
