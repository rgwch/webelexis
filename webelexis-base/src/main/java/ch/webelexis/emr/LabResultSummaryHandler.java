/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.emr;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import ch.webelexis.Cleaner;
import ch.webelexis.Mapper;
import ch.webelexis.ParametersException;

import java.util.HashMap;
import java.util.Iterator;

/**
 * Quite simple: Just return all lab results of a given patient. For efficiency
 * reasons, we fetch all interesting fields in a single join.
 *
 * @author gerry
 */
public class LabResultSummaryHandler implements Handler<Message<JsonObject>> {
    Verticle v;
    EventBus eb;
    Logger log;
    String[] fields = new String[]{"v.Datum", "v.ItemID", "li.titel", "v.Resultat", "v.Kommentar", "li.kuerzel",
            "li.Gruppe", "li.prio", "li.RefMann", "li.RefFrauOrTx", "k.Geschlecht"};

    public LabResultSummaryHandler(Verticle server) {
        v = server;
        this.eb = v.getVertx().eventBus();
        this.log = v.getContainer().logger();
    }

    @Override
    public void handle(Message<JsonObject> externalRequest) {
        Cleaner cl = new Cleaner(externalRequest);
        try {
            log.debug("LabResultSummaryHandler: Handling " + externalRequest.body().encode());
            String patId = cl.get("patid", Cleaner.UID, false);
            Mapper mapper = new Mapper(fields);
            String query = "SELECT FIELDS FROM LABORWERTE as v, LABORITEMS as li, KONTAKT as k where v.PatientID=? and v.ItemID=li.id and v.PatientID=k.id and v.deleted='0' order by v.Datum";

            JsonObject jo = new JsonObject().putString("action", "prepared")
                    .putString("statement", mapper.mapToString(query, "FIELDS"))
                    .putArray("values", new JsonArray(new String[]{patId}));
            log.debug("sending message :" + jo.encodePrettily());
            eb.send("ch.webelexis.sql", jo, new SqlResult(cl));

        } catch (ParametersException e) {
            e.printStackTrace();
            log.error("Parameter error " + cl.toString());
            cl.replyError("parameter error");
        }
    }

    class SqlResult implements Handler<Message<JsonObject>> {
        Cleaner cl;

        SqlResult(Cleaner c) {
            this.cl = c;
        }

        @Override
        public void handle(Message<JsonObject> sqlAnswer) {
            log.debug("LabResult: Got answer from sql server: " + sqlAnswer.body().encodePrettily());
            JsonObject result = sqlAnswer.body();
            /* Elexis duplicates or triplicates some lab results, so we must filter this out to reduce network load and confusion of the user */
            JsonArray vals = result.getArray("results");
            log.debug(vals.size() + " elements in list");
            JsonArray uniq = new JsonArray();
            Iterator it = vals.iterator();
            HashMap<String, Boolean> check = new HashMap<String, Boolean>();
            // We consider lab results as identical, if date, itemID and value are the same
            while (it.hasNext()) {
                JsonArray row = (JsonArray) it.next();
                String key = row.get(0) + row.get(1) + row.get(3);
                if (!check.containsKey(key)) {
                    check.put(key, true);
                    uniq.add(row);
                } else {
                    log.debug("filtered out " + row.get(2));
                }
            }
            result.putArray("results", uniq);
            log.debug("Filtered lab result: " + uniq.encodePrettily());
            log.debug(uniq.size() + " elements in list");
            cl.reply(result);
        }

    }
}
