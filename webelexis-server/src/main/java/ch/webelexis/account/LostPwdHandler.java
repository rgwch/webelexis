/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.account;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;
import io.vertx.core.AsyncResult;
import io.vertx.core.AsyncResultHandler;
import io.vertx.core.Handler;
import io.vertx.core.Verticle;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;

import java.util.UUID;
import java.util.logging.Logger;

/**
 * The user forgot their password, so we generate a random password and send
 * that by mail parameter: username
 *
 * @author gerry
 */
class LostPwdHandler implements Handler<Message<JsonObject>> {
  private final Verticle server;
  private final Logger log = Logger.getLogger("LostPwdHandler");
  private final JsonObject cfg;

  public LostPwdHandler(Verticle server, JsonObject cfg) {
    this.server = server;
    this.cfg = cfg;
  }

  @Override
  public void handle(Message<JsonObject> externalRequest) {
    final Cleaner cl = new Cleaner(externalRequest);
    try {
      final String username = cl.get("username", Cleaner.MAIL, false);
      final UserDetailHandler udh = new UserDetailHandler(server);
      udh.getUser(username, user -> {
        if (user == null) {
          cl.replyError("user not found " + username);
        } else {
          final JsonObject mailCfg = cfg.getJsonObject("mails");
          final String newPassword = UUID.randomUUID().toString();
          user.put("pwhash", UserDetailHandler.makeHash(username, newPassword));
          udh.putUser(user, new Handler<Boolean>() {

            @Override
            public void handle(Boolean result) {
              if (result) {
                String bcc = mailCfg.getString("bcc");
                String lpwd = mailCfg.getString("lostpwd_body");
                if (lpwd == null) {
                  cl.replyError("configuration error on server");
                }
                JsonObject mail = new JsonObject().put("from", mailCfg.getString("from"))
                  .put("to", username).put("subject",
                    mailCfg.getString("lostpwd_subject")).put(
                    "body",
                    mailCfg.getString("lostpwd_body").replaceFirst("%password%",
                      newPassword));
                if (bcc != null) {
                  mail.put("bcc", bcc);
                }
                server.getVertx().eventBus().send("ch.webelexis.mailer", mail,
                  new AsyncResultHandler<Message<JsonObject>>() {

                    @Override
                    public void handle(AsyncResult<Message<JsonObject>> result) {
                      if (result.result().body().getString("status").equals("ok")) {
                        cl.replyOk();
                      } else {
                        cl.replyError("System error sending mail.");
                        log.warning("could not send mail. " + result.result().body().encode());
                      }

                    }
                  });

              }

            }

          });

        }
      });
    } catch (ParametersException pex) {
      log.severe(pex.getMessage());
      cl.replyError("parameter error");
    }

  }

}
