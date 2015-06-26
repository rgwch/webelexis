/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.emr;

import ch.rgw.tools.VersionedResource;
import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

public class ConsultationHandler implements Handler<Message<JsonObject>> {
    Verticle v;
    EventBus eb;
    Logger log;
    String[] fields = new String[]{"k.datum", "k.diagnosen", "k.eintrag"};
    final static String sql = "select k.id, k.datum, k.diagnosen, k.eintrag from BEHANDLUNGEN as k, FAELLE as f, KONTAKT as ko where ko.id=? and f.patientid=ko.id and k.fallid=f.id and k.deleted='0' order by k.datum DESC";

    public ConsultationHandler(Verticle server) {
        v = server;
        this.eb = v.getVertx().eventBus();
        this.log = v.getContainer().logger();
    }

    @Override
    public void handle(Message<JsonObject> externalRequest) {
        Cleaner cl = new Cleaner(externalRequest);
        try {
            final String action = cl.get("action", Cleaner.WORD, false);
            if (action.equals("list")) {
                final String patid = cl.get("patid", Cleaner.UID, false);
                JsonObject jo = new JsonObject().putString("action", "prepared").putString("statement", sql)
                        .putArray("values", new JsonArray(new String[]{patid}));
                log.debug("sending query " + jo.encodePrettily());
                eb.send("ch.webelexis.sql", jo, new GetListResult(cl));
            } else if (action.equals("get")) {
                final String consid = cl.get("consid", Cleaner.UID, false);
                JsonObject jo = new JsonObject().putString("action", "prepared")
                        .putString("statement", "SELECT id,datum,diagnosen,eintrag from BEHANDLUNGEN where id=?")
                        .putArray("values", new JsonArray(new String[]{consid}));
                log.debug("sending query: " + jo.encodePrettily());
                eb.send("ch.webelexis.sql", jo, new GetConsResult(cl));
            }
        } catch (ParametersException pex) {
            log.error(pex.getStackTrace());
            cl.replyError(pex.getMessage());
        }
    }

    class GetListResult implements Handler<Message<JsonObject>> {
        Cleaner cl;

        GetListResult(Cleaner c) {
            this.cl = c;
        }

        @Override
        public void handle(Message<JsonObject> sqlAnswer) {
            //log.debug("ConsListHandler: Got answer from sql server: " + sqlAnswer.body().encodePrettily());
            JsonObject result = sqlAnswer.body();
            if (result.getString("status").equals("ok")) {
                JsonArray rows = result.getArray("results");
                JsonArray ret = new JsonArray();
                for (Object o : rows) {
                    JsonObject jk = rowToObject((JsonArray) o);
                    if (jk != null) {
                        ret.add(jk);
                    }
                }
                cl.reply(new JsonObject().putString("status", "ok").putArray("results", ret));
            } else {
                cl.replyError(result.getString("message"));
            }

        }
    }

    private JsonObject rowToObject(JsonArray row) {
        if (row.size() >= 4) {
            JsonObject jk = new JsonObject();
            jk.putString("id", (String) row.get(0));
            jk.putString("date", (String) row.get(1));
            jk.putString("diags", (String) row.get(2));
            JsonArray entry = (JsonArray) row.get(3);
            if (entry != null) {
                byte[] ba = new byte[entry.size()];
                for (int i = 0; i < entry.size(); i++) {
                    ba[i] = (byte) entry.get(i);
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
                jk.putString("entry", ke);
                return jk;
            }
        }
        return null;
    }

    class GetConsResult implements Handler<Message<JsonObject>> {
        Cleaner cl;

        GetConsResult(Cleaner c) {
            this.cl = c;
        }

        @Override
        public void handle(Message<JsonObject> sqlAnswer) {
            //log.debug("ConsResultHandler: Got answer from sql server: " + sqlAnswer.body().encodePrettily());
            JsonObject result = sqlAnswer.body();
            if (result.getString("status").equals("ok")) {
                JsonArray rows = (JsonArray) result.getArray("results");
                if (rows.size() > 0) {
                    JsonObject jk = rowToObject((JsonArray) rows.get(0));
                    if (jk != null) {
                        cl.reply(new JsonObject().putString("status", "ok").putObject("result", jk));
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
