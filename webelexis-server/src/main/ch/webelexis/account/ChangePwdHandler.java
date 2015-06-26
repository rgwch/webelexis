/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.account;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import io.vertx.core.AbstractVerticle;

import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * The user wants to change their password parameters:username, old-pwd, new-pwd
 *
 * @author gerry
 */
public class ChangePwdHandler implements Handler<Message<JsonObject>> {
    AbstractVerticle server;
    Logger log = Logger.getLogger("ChangePwdHandler");
    JsonObject cfg;
    UserDetailHandler udh;

    public ChangePwdHandler(AbstractVerticle server, JsonObject cfg) {
        this.server = server;
        this.cfg = cfg;
        udh = new UserDetailHandler(server);
    }

    @Override
    public void handle(Message<JsonObject> externalRequest) {
        final Cleaner cl = new Cleaner(externalRequest);
        try {
            final String username = cl.get("username", Cleaner.TEXT, false);
            final String oldPwd = cl.get("old-pwd", Cleaner.NOTEMPTY, false);
            final String newPwd = cl.get("new-pwd", Cleaner.NOTEMPTY, false);
            udh.getUser(username, new Handler<JsonObject>() {

                @Override
                public void handle(JsonObject user) {
                    if (user == null) {
                        cl.replyError("user not found");
                    } else {
                        byte[] checkBytes = UserDetailHandler.makeHash(username, oldPwd);
                        byte[] userBytes = user.getBinary("pwhash");
                        if (userBytes == null) {
                            userBytes = UserDetailHandler.makeHash(username, user.getString("password"));
                            user.remove("password");
                        }
                        if (Arrays.equals(userBytes, checkBytes)) {
                            user.put("pwhash", UserDetailHandler.makeHash(username, newPwd));
                            udh.putUser(user, new Handler<Boolean>() {

                                @Override
                                public void handle(Boolean result) {
                                    if (result) {
                                        cl.replyOk();
                                    } else {
                                        log.log(Level.SEVERE, "could not update password");
                                        cl.replyError("system error: Could not update password");
                                    }

                                }
                            });
                        } else {
                            cl.replyError("bad password");
                        }
                    }

                }
            });

        } catch (ParametersException pex) {
            log.log(Level.SEVERE, pex.getMessage(), pex);
            cl.replyError("parameter error");
        }

    }

}
