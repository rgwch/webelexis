/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.account;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.Verticle;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import io.vertx.core.AbstractVerticle;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class UserDetailHandler {
  Verticle verticle;
  EventBus eb;
  Logger log = Logger.getLogger("UserDetailHandler");

  public UserDetailHandler(Verticle v) {
    verticle = v;
    eb = v.getVertx().eventBus();
  }

  /**
   * Get a User from the Mongo-Database.
   *
   * @param id      User-ID
   * @param handler a Handler<JsonObject> to call with the Result. The result is
   *                either the User, or null if no such user was found or if an error
   *                happened (in that case, more Info is in the log)
   */
  public void getUser(final String id, final Handler<JsonObject> handler) {
    JsonObject query = new JsonObject().put("action", "findone").put("collection", "users")
      .put("matcher", new JsonObject().put("username", id));
    eb.send("ch.webelexis.nosql", query, ar -> {
      if (ar.succeeded()) {
        JsonObject result = ((JsonObject) ar.result().body());
        // TODO: more checks on completeness and sync with medelexis
        if (result.getString("status").equals("ok")) {
          handler.handle(result.getJsonObject("result"));
        } else {
          log.log(Level.SEVERE, "severe: could not access nosql server " + result.encodePrettily());
          handler.handle(null);
        }
      }
    });

  }

  public void putUser(final JsonObject user, final Handler<Boolean> handler) {
    JsonObject op = new JsonObject().put("action", "update").put("collection", "users")
      .put("criteria", new JsonObject().put("username", user.getString("username")))
      .put("objNew", user).put("upsert", true).put("multi", false);
    eb.send("ch.webelexis.nosql", op, (AsyncResult<Message<JsonObject>> ar) -> {
      if (ar.succeeded()) {
        Message<JsonObject> answer = ar.result();
        if (answer.body().getString("status").equals("ok")) {
          handler.handle(true);
        } else {
          log.log(Level.SEVERE, "severe: could not update document on nosql server. " + answer.body().encodePrettily());
          handler.handle(false);
        }

      }
    });
  }

  public static byte[] makeHash(String username, String password) {
    try {

      MessageDigest md = MessageDigest.getInstance("MD5");
      md.update(username.getBytes("utf-8"));
      return md.digest(password.getBytes("utf-8"));

    } catch (NoSuchAlgorithmException e) {
      // should not happen
      e.printStackTrace();
    } catch (UnsupportedEncodingException e) {
      // should not happen
      e.printStackTrace();
    }
    return null;
  }

}
