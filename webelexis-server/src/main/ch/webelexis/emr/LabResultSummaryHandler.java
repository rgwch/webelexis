/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.emr;

import ch.rgw.vertx.Util;
import ch.webelexis.Cleaner;
import ch.webelexis.Mapper;
import ch.webelexis.ParametersException;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.AsyncResult;
import io.vertx.core.AsyncResultHandler;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.logging.Logger;

/**
 * Quite simple: Just return all lab results of a given patient. For efficiency
 * reasons, we fetch all interesting fields in a single join.
 *
 * @author gerry
 */
public class LabResultSummaryHandler implements Handler<Message<JsonObject>> {
    AbstractVerticle v;
    EventBus eb;
    Logger log = java.util.logging.Logger.getLogger("LabResultSummaryHAndler");
    String[] fields = new String[]{"v.Datum", "v.ItemID", "li.titel", "v.Resultat", "v.Kommentar", "li.kuerzel",
            "li.Gruppe", "li.prio", "li.RefMann", "li.RefFrauOrTx", "k.Geschlecht"};

    public LabResultSummaryHandler(AbstractVerticle server) {
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
            String query = "SELECT FIELDS FROM LABORWERTE as v, LABORITEMS as li, KONTAKT as k where v.PatientID=? and v.ItemID=li.id and v.PatientID=k.id and v.deleted='0' order by v.Datum";

            JsonObject jo = new JsonObject().put("action", "prepared")
                    .put("statement", mapper.mapToString(query, "FIELDS"))
                    .put("values", Util.asJsonArray(patId));
            log.finest("sending message :" + jo.encodePrettily());
            eb.send("ch.webelexis.sql", jo, new SqlResult(cl));

        } catch (ParametersException e) {
            e.printStackTrace();
            log.warning("Parameter error " + cl.toString());
            cl.replyError("parameter error");
        }
    }

    class SqlResult implements AsyncResultHandler<Message<JsonObject>> {
        Cleaner cl;

        SqlResult(Cleaner c) {
            this.cl = c;
        }

        @Override
        public void handle(AsyncResult<Message<JsonObject>> asyncResult) {
            if (asyncResult.succeeded()) {
                log.finest("LabResult: Got answer from sql server: " + asyncResult.result().body().encodePrettily());
                JsonObject result = asyncResult.result().body();
            /* Elexis duplicates or triplicates some lab results, so we must filter this out to reduce network load and confusion of the user */
                JsonArray vals = result.getJsonArray("results");
                log.finest(vals.size() + " elements in list");
                JsonArray uniq = new JsonArray();
                Iterator it = vals.iterator();
                HashMap<String, Boolean> check = new HashMap<String, Boolean>();
                // We consider lab results as identical, if date, itemID and value are the same
                while (it.hasNext()) {
                    JsonArray row = (JsonArray) it.next();
                    String key = row.getString(0) + row.getString(1) + row.getString(3);
                    if (!check.containsKey(key)) {
                        check.put(key, true);
                        uniq.add(row);
                    } else {
                        log.finest("filtered out " + row.getString(2));
                    }
                }
                result.put("results", uniq);
                log.finest("Filtered lab result: " + uniq.encodePrettily());
                log.finest(uniq.size() + " elements in list");
                cl.reply(result);
            }
        }

    }
}
