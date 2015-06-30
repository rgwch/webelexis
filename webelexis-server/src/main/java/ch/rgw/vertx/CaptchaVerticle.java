package ch.rgw.vertx;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;
import java.util.logging.Logger;

import javax.imageio.ImageIO;

import com.google.code.kaptcha.impl.DefaultKaptcha;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.AsyncResult;
import io.vertx.core.AsyncResultHandler;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

public class CaptchaVerticle extends AbstractVerticle {
  EventBus eb;
  Logger log = Logger.getLogger("CaptchaVerticle");
  Config cfg;
  Map<String, JsonArray> captchas = new HashMap<String, JsonArray>();
  String mongo;
  String collection;
  long timeout;

  @Override
  public void start() {
    JsonObject conf = config().getJsonObject("captcha");
    eb = vertx.eventBus();
    if (conf == null) {
      log.severe("no admin address provided.");
    }
    cfg = new Config(conf);
    String address = conf.getString("address");
    mongo = conf.getString("persistor_address");
    timeout = cfg.getOptionalLong("timeout", 120000);
    collection = cfg.getOptionalString("collection", "captchas");
    eb.consumer(address + ".create", captchaCreateHandler);
    eb.consumer(address + ".verify", captchaVerifyHandler);
    eb.consumer(address + ".add", addCaptchaHandler);
  }

  private Handler<Message<JsonObject>> captchaCreateHandler = new Handler<Message<JsonObject>>() {

    @Override
    public void handle(final Message<JsonObject> externalRequest) {
      JsonObject job = new JsonObject().put("action", "count").put("collection", collection);
      eb.send(mongo, job, m01 -> {

        JsonObject m1 = (JsonObject) m01.result().body();
        /* query number of predefined captchas */
        if (m1.getString("status").equals("ok")) {
            /* select an arbitrary captcha between 0 and count-1 */
          double count = m1.getInteger("count");
          int chose = (int) (count * Math.random());
          JsonObject job2 = new JsonObject().put("action", "find").put("collection", collection)
            .put("skip", chose).put("limit", 1);

          eb.send(mongo, job2, m2 -> {

            if (m2.succeeded()) {
              if (((JsonObject) m2.result().body()).getString("status").equals("ok")) {
                makeCaptcha(m2, externalRequest);

              } else {
                Util.sendError(externalRequest, "database error m2 " + ((JsonObject) m2.result().body()).encode());
              }

            } else {
              Util.sendError(externalRequest, "internal error");
            }
          });
        } else {
          Util.sendError(externalRequest, "database error m1 " + m1.encode());
        }
      });
    }
  };
  private Handler<Message<JsonObject>> captchaVerifyHandler = new Handler<Message<JsonObject>>() {

    @Override
    public void handle(Message<JsonObject> externalRequest) {
      String token = Util.getParm("token", externalRequest);
      JsonArray answers = captchas.get(token);
      if (answers == null) {
        Util.sendStatus(externalRequest, "failure");
      } else {
        String answer = Util.getParm("answer", externalRequest);
        if (answers.contains(answer)) {
          Util.sendOK(externalRequest);
        } else {
          Util.sendStatus(externalRequest, "failure");
        }
      }

    }

  };

  private Handler<Message<JsonObject>> addCaptchaHandler = new Handler<Message<JsonObject>>() {

    @Override
    public void handle(final Message<JsonObject> externalRequest) {
      JsonArray captchas = externalRequest.body().getJsonArray("questions");
      if (captchas == null) {
        Util.sendError(externalRequest, "nothing added");
      } else {
        JsonObject cmd = new JsonObject().put("insert", collection).put("documents", captchas);
        JsonObject job = new JsonObject().put("action", "command").put("command", cmd);
        eb.send(mongo, job, m1 -> {
          if (m1.succeeded()) {
            if (((JsonObject) m1.result().body()).getString("status").equals("ok")) {
              Util.sendOK(externalRequest);
            } else {
              Util.sendError(externalRequest, ((JsonObject) m1.result().body()).encode());
            }
          } else {
            Util.sendError(externalRequest, "internal error");
          }
        });
      }
    }
  };


  private void makeCaptcha(AsyncResult<Message<Object>> m2, Message<JsonObject> externalRequest) {
  /* create captcha with random token or given token */
    final String token = externalRequest.body().containsKey("token") ? externalRequest.body()
      .getString("token") : UUID.randomUUID().toString();
    JsonObject result = ((JsonObject) m2.result().body()).getJsonArray("results").getJsonObject(0);
    JsonArray answers = result.getJsonArray("a");
    captchas.put(token, answers);
    vertx.setTimer(timeout, new Handler<Long>() {

      @Override
      public void handle(Long arg0) {
          /* The captcha was not solved within timeout milliseconds -> delete it */
        captchas.remove(token);
      }
    });
    JsonObject answer = new JsonObject().put("q", result.getString("q")).put("token", token);
                  /* should we generate a captcha? */
    boolean create = result.getBoolean("create", false);
    if (!create) {

      String url = result.getString("url");
      if (url != null && url.length() > 0) {
        answer.put("url", url);
      }
      Util.sendOK(externalRequest, answer);
    } else { // create captcha on the fly
      try {
        DefaultKaptcha k = new DefaultKaptcha();
        k.setConfig(new com.google.code.kaptcha.util.Config(new Properties()));
        String cText = k.createText();
        BufferedImage kimg = k.createImage(cText);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(kimg, "png", baos);
        byte[] img = baos.toByteArray();
        answer.put("image", img);
        captchas.put(token, new JsonArray().add(cText));
        baos.close();
        Util.sendOK(externalRequest, answer);
      } catch (IOException e) {
        Util.sendError(externalRequest, e.getMessage());
        e.printStackTrace();
      }
    }
  }
}