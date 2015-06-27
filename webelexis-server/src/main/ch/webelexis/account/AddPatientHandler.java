/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.account;

import ch.rgw.vertx.Util;
import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;
import io.vertx.core.AsyncResult;
import io.vertx.core.AsyncResultHandler;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.AbstractVerticle;

import java.util.UUID;
import java.util.logging.Level;

import static ch.webelexis.Cleaner.*;

/**
 * Add a new Account for an existing patient or a new patient and a new account
 *
 * @author gerry
 */
public class AddPatientHandler implements Handler<Message<JsonObject>> {
    AbstractVerticle server;
    JsonObject cfg;
    java.util.logging.Logger log = java.util.logging.Logger.getLogger("AddPatientHandler");
    EventBus eb;
    UserDetailHandler udh;
    private String[] fields = {"id", "Bezeichnung1", "Bezeichnung2", "Geburtsdatum", "Strasse",
            "Plz", "Ort", "Telefon1", "NatelNr", "Email", "Bemerkung", "istPatient"};

    public AddPatientHandler(AbstractVerticle server, JsonObject cfg) {
        this.server = server;
        this.cfg = cfg;
        eb = server.getVertx().eventBus();
        udh = new UserDetailHandler(server);
    }

    @Override
    public void handle(final Message<JsonObject> externalRequest) {
        log.info("add patient: " + externalRequest.body().encodePrettily());
        final Cleaner c = new Cleaner(externalRequest);

        try {
            // check if username exists in webelexis users
            udh.getUser(c.get("username", MAIL, false), new Handler<JsonObject>() {

                public void handle(JsonObject user) {
                    if (user != null) {
                        log.warning("user exists " + externalRequest.body().getString("username"));
                        /* user exists: error */
                        c.replyError("user exists");
                    } else {
                        try {
                            /* user does not exist; check if patient exists */
                            String sql = "select id from KONTAKT where Bezeichnung1=? and Bezeichnung2=? and Geburtsdatum=? and deleted='0'";
                            JsonObject jo = new JsonObject().put("action", "prepared").put(
                                    "statement", sql)
                                    .put(
                                            "values", Util.asJsonArray(new String[]{c.get("name", NAME, false),
                                                    c.get("vorname", NAME, false),
                                                    c.get("geburtsdatum", ELEXISDATE, false)}));
                            eb.send("ch.webelexis.sql", jo, new QueryResultHandler(c));
                        } catch (ParametersException pex) {
                            log.log(Level.SEVERE, pex.getMessage(), pex);
                            c.replyError("parameter error");
                        }
                    }

                }

            });
        } catch (ParametersException pex) {
            log.log(Level.SEVERE, pex.getMessage(), pex);
            c.replyError("parameter error");
        }
    }

    /**
     * Called after query if patient exists in Elexis database
     */
    class QueryResultHandler implements AsyncResultHandler<Message<JsonObject>> {

        Cleaner c;

        QueryResultHandler(Cleaner externalRequestCleaner) {
            c = externalRequestCleaner;
        }

        @Override
        public void handle(final AsyncResult<Message<JsonObject>> result) {
            if (result.succeeded()) {
                JsonObject rb = result.result().body();
                log.log(Level.FINEST, "SQL user answer: " + rb.encodePrettily());
                if (rb.getString("status").equals("ok")) {
                    if (rb.getJsonArray("results").size() > 0) {
					/* Patient exists, just create user */
                        JsonArray row = rb.getJsonArray("results").getJsonArray(0);
                        final String pid = row.getString(0);
                        addUser(c, pid);
                    } else {
                        try {
						/* create Patient and user */
                            String pid = UUID.randomUUID().toString();
                            log.log(Level.FINEST, "creating Elexis user " + pid);
                            JsonArray row = new JsonArray().add(pid).add(c.get("name", NAME, false))
                                    .add(c.get("vorname", NAME, false)).add(
                                            c.get("geburtsdatum", ELEXISDATE, false)).add(
                                            c.get("strasse", TEXT, true)).add(c.get("plz", ZIP, true)).add(
                                            c.get("ort", NAME, true)).add(c.get("telefon", PHONE, true))
                                    .add(c.get("mobil", PHONE, true)).add(c.get("email", MAIL, false))
                                    .add("via webelexis").add("1");
                            JsonArray values = new JsonArray().add(row);
                            JsonObject sql = new JsonObject().put("action", "insert").put("table",
                                    "KONTAKT").put("fields", Util.asJsonArray(fields)).put("values", values);
                            eb.send("ch.webelexis.sql", sql, new SqlResultHandler(c, pid));
                        } catch (ParametersException pex) {
                            log.log(Level.SEVERE, pex.getMessage(), pex);
                            c.replyError("parameter error");
                        }

                    }
                } else {
                    log.log(Level.SEVERE, rb.getString("status") + " " + rb.getString("message"));
                    c.replyError();
                }
            }
        }

    }

    /* called after created new patient */
    class SqlResultHandler implements AsyncResultHandler<Message<JsonObject>> {
        Cleaner c;
        String pid;

        SqlResultHandler(Cleaner externalRequestCleaner, String pid) {
            c = externalRequestCleaner;
            this.pid = pid;
        }

        @Override
        public void handle(final AsyncResult<Message<JsonObject>> result) {
            if (result.succeeded()) {
                if (result.result().body().getString("status").equals("ok")) {
                    addUser(c, pid);
                } else {
                    log.log(Level.SEVERE, result.result().body().encodePrettily());
                    c.replyError();
                }

            }
        }
    }

    void addUser(final Cleaner cle, final String pid) {
        log.log(Level.FINEST, "mongo insert: " + cle.toString());
        try {
            final JsonObject user = new JsonObject().put("username",
                    cle.get("username", MAIL, false)).put("patientid", pid).put("firstname",
                    cle.get("vorname", NAME, false)).put("lastname", cle.get("name", NAME, false));
            user.put("roles", new JsonArray().add(cfg.getString("defaultRole")));
            String pwd = cle.getOptional("pass", null);
            final String confirmURL = cle.get("origin", Cleaner.URL, false) + "/#verify/"
                    + user.getString("username") + "/";
            if (pwd != null) {
                user.put("pwhash", UserDetailHandler.makeHash(user.getString("username"), pwd));
            }
            if (cfg.getBoolean("confirm-mail", false)) {
                user.put("verified", false);
                user.put("confirmID", UUID.randomUUID().toString());
            } else {
                user.put("verified", true);
            }
            udh.putUser(user, new Handler<Boolean>() {
                @Override
                public void handle(Boolean insertOK) {
                    if (insertOK) {
                        if (cfg.getBoolean("confirm-mail", false)) {
                            final JsonObject mailCfg = cfg.getJsonObject("mails");
                            String bcc = mailCfg.getString("bcc");
                            final JsonObject mail = new JsonObject().put("from", mailCfg.getString("from"))
                                    .put("to", user.getString("username")).put(
                                            "body",
                                            mailCfg.getString("activation_body").replaceFirst("%activationcode%",
                                                    confirmURL + user.getString("confirmID"))).put("subject",
                                            mailCfg.getString("activation_subject"));
                            if (bcc != null) {
                                mail.put("bcc", bcc);
                            }
                            eb.send("ch.webelexis.mailer", mail, new AsyncResultHandler<Message<JsonObject>>() {

                                @Override
                                public void handle(AsyncResult<Message<JsonObject>> mailerReply) {
                                    if (mailerReply.succeeded()) {
                                        if (mailerReply.result().body().getString("status").equals("ok")) {
                                            cle.replyOk();
                                        } else {
                                            log.log(Level.SEVERE, "mailer error: " + mailerReply.result().body().encodePrettily());
                                            cle.replyError("mail error.");
                                        }
                                    }
                                }
                            });

                        } else { // no confirmation mail; we're done
                            cle.replyOk();
                        }

                    } else {
                        // inserOK was false
                        cle.replyError("could not create user in nosql");

                    }
                }
            });

        } catch (ParametersException pex) {
            log.log(Level.SEVERE, pex.getMessage(), pex);
            cle.replyError("parameter error");

        }
    }
}
