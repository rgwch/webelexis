/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;

import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * A handler proxy for authorization. Checks first, if the user has the role
 * needed for the requested task and either forwards the call to the real
 * handler, or rejects it with a "denied" message to the caller
 *
 * @author gerry
 */
public class AuthorizingHandler implements Handler<Message<JsonObject>> {
  final Handler<Message<JsonObject>> realHandler;
  final String roleToCheck;
  final AbstractVerticle bm;
  final Logger log = Logger.getLogger(getClass().getName());

  public AuthorizingHandler(AbstractVerticle server, String roleToCheck,
                            Handler<Message<JsonObject>> originalHandler) {
    realHandler = originalHandler;
    this.roleToCheck = roleToCheck;
    this.bm = server;

  }

  @Override
  public void handle(final Message<JsonObject> originalMsg) {
    log.log(Level.FINEST, originalMsg.body().encodePrettily());
    final Cleaner cl = new Cleaner(originalMsg);
    if (roleToCheck == null || roleToCheck.length() == 0) {
      originalMsg.reply(new JsonObject().put("status", "denied").put("message",
        "roleToCheck missing"));
    } else {
      // access to resources for "guest" is always granted
      if (roleToCheck.equalsIgnoreCase("guest")) {
        realHandler.handle(originalMsg);
      } else {
        try {
          bm.getVertx().eventBus().send(
            "ch.webelexis.session.authorize",
            new JsonObject().put("role", roleToCheck).put("sessionID",
              cl.get("sessionID", Cleaner.NAME, false)), ar -> {
              if (ar.succeeded()) {
                JsonObject authMsg = (JsonObject) ar.result().body();
                if (authMsg.getString("status").equals("ok")) {
                  log.log(Level.FINEST,
                    "AuthorizingHandler: " + authMsg.encodePrettily());
                  originalMsg.body().put("authorized_user",
                    authMsg.getJsonObject("authorized_user"));
                  realHandler.handle(originalMsg);
                } else {
                  originalMsg.reply(new JsonObject().put("status", "denied")
                    .put("message",
                      " insufficient rights for resource. Required " + roleToCheck));
                  log.log(Level.INFO,"Access denied for "+roleToCheck);
                }
              } else {
                cl.replyError("Message Bus error " + ar.toString());
              }
            });
        } catch (ParametersException pex) {
          log.log(Level.SEVERE, pex.getMessage(), pex);
          cl.replyError("parameter error");
        }
      }
    }

  }

}
