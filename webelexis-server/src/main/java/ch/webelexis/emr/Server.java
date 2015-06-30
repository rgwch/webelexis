/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.emr;

import ch.webelexis.AuthorizingHandler;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;

import java.util.logging.Logger;

public class Server extends AbstractVerticle {
  private final Logger log = Logger.getLogger("EMR Server");
  private JsonObject cfg;
  private EventBus eb;

  @Override
  public void start() {
    cfg = config().getJsonObject("emr");
    eb = vertx.eventBus();
    //log.info("EMR Server started. got config " + cfg.encodePrettily());
    eb.consumer("ch.webelexis.patient.detail", new AuthorizingHandler(this, cfg.getString(
      "role", "admin"), new PatientDetailHandler(this)));
    eb.consumer("ch.webelexis.patient.find", new AuthorizingHandler(this, cfg.getString("role", "admin"), new FindPatientHandler(this)));

    if (cfg.getBoolean("lab", false) == true) {
      final LabResultSummaryHandler labResultHandler = new LabResultSummaryHandler(this);
      eb.consumer("ch.webelexis.patient.labresult", new AuthorizingHandler(this, cfg
        .getString("role", "admin"), request -> {
          log.finest("EMR server; got request: " + request.body().encode());
          String mode = request.body().getString("mode");
          if (mode == null || mode.equals("latest")) {
            labResultHandler.handle(request);
          } else if (mode.equals("selection")) {
            // probably later
          }

      }));
    }
    if (cfg.getBoolean("consultations", false) == true) {
      final ConsultationHandler consHandler = new ConsultationHandler(this);
      eb.consumer("ch.webelexis.patient.cons", new AuthorizingHandler(this, cfg.getString(
        "role", "admin"), consHandler));
    }
  }
}
