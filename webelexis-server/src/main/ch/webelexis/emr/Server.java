/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.emr;

import ch.webelexis.AuthorizingHandler;
import org.vertx.java.busmods.BusModBase;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;

public class Server extends BusModBase {
    Logger log;
    JsonObject cfg;
    EventBus eb;

    @Override
    public void start() {
        log = container.logger();
        cfg = container.config();
        eb = vertx.eventBus();
        log.info("EMR Server started. got config " + cfg.encodePrettily());
        eb.registerHandler("ch.webelexis.patient.detail", new AuthorizingHandler(this, cfg.getString(
                "role", "admin"), new PatientDetailHandler(this)));
        eb.registerHandler("ch.webelexis.patient.find", new AuthorizingHandler(this, cfg.getString("role", "admin"), new FindPatientHandler(this)));

        if (cfg.getBoolean("lab", false) == true) {
            final LabResultSummaryHandler labResultHandler = new LabResultSummaryHandler(this);
            eb.registerHandler("ch.webelexis.patient.labresult", new AuthorizingHandler(this, cfg
                    .getString("role", "admin"), new Handler<Message<JsonObject>>() {

                @Override
                public void handle(Message<JsonObject> request) {
                    log.debug("EMR server; got request: " + request.body().encode());
                    String mode = request.body().getString("mode");
                    if (mode == null || mode.equals("latest")) {
                        labResultHandler.handle(request);
                    } else if (mode.equals("selection")) {
                        // probably later
                    }

                }
            }));
        }
        if (cfg.getBoolean("consultations", false) == true) {
            final ConsultationHandler consHandler = new ConsultationHandler(this);
            eb.registerHandler("ch.webelexis.patient.cons", new AuthorizingHandler(this, cfg.getString(
                    "role", "admin"), consHandler));
        }
    }
}
