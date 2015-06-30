/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.account;

import ch.webelexis.AuthorizingHandler;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.JsonObject;

import java.util.logging.Logger;

public class Server extends AbstractVerticle {

  @Override
  public void start() {
    JsonObject cfg = config();
    String role = cfg.getString("role", "admin");
    Logger.getLogger("account").finest("Account Server got config: " + cfg.encodePrettily());
    vertx.eventBus().consumer("ch.webelexis.patient.add", new AuthorizingHandler(this, role, new AddPatientHandler(this, cfg)));
    vertx.eventBus().consumer("ch.webelexis.patient.verify",
      new AuthorizingHandler(this, role, new VerifyAccountHandler(this)));
    vertx.eventBus().consumer("ch.webelexis.patient.lostpwd", new AuthorizingHandler(this, role, new LostPwdHandler(this,
      cfg)));
    vertx.eventBus().consumer("ch.webelexis.patient.changepwd", new AuthorizingHandler(this, role, new ChangePwdHandler(this,
      cfg)));
  }

}
