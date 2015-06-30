/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.account;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;

import java.util.logging.Logger;

/**
 * A new user has been created. If they enter the correct code which was sent
 * per mail, the account becomes active.<br>
 * parameters: username, verify (the verification code)
 *
 * @author gerry
 */
class VerifyAccountHandler implements Handler<Message<JsonObject>> {
  private final Server server;
  private final Logger log = Logger.getLogger("VerifyAccountHandler");
  private final UserDetailHandler udh;

  public VerifyAccountHandler(Server server) {
    this.server = server;
    udh = new UserDetailHandler(server);
  }

  @Override
  public void handle(Message<JsonObject> externalRequest) {
    final Cleaner cl = new Cleaner(externalRequest);
    try {
      final String uname = cl.get("username", Cleaner.MAIL, false);
      final String code = cl.get("verify", Cleaner.UID, false);
      udh.getUser(uname, user -> {
        if (user == null) {
          cl.replyError("user not found");
        } else {
          String cfid = user.getString("confirmID");
          if (cfid == null) {
            cl.replyError("account not waiting for verification");
          } else {
            if (user.getString("confirmID").equals(code)) {
              user.put("verified", true);
              user.remove("confirmID");
              udh.putUser(user, result -> {
                if (result) {
                  cl.replyOk();
                } else {
                  cl.replyError("system error: Could not write user");
                }
              });
            } else {
              cl.replyError("bad verification code");
            }
          }
        }
      });
    } catch (ParametersException pex) {
      log.severe(pex.getMessage());
      cl.replyError("parameter error");
    }
  }
}
