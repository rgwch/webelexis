package ch.webelexis.tests;

import java.io.IOException;

import org.junit.Test;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.DecodeException;
import org.vertx.java.core.json.JsonObject;
import org.vertx.testtools.TestVerticle;
import org.vertx.testtools.VertxAssert;

import ch.webelexis.Cleaner;
import ch.webelexis.emr.ConsultationHandler;

public class LoadKonsTest extends TestVerticle {
  long DELAY = 50;

  public void start() {
    initialize();
    try {
      JsonObject cfg=Cleaner.createFromFile("cfglocal.json");
      container.deployModule("io.vertx~mod-mysql-postgresql_2.10~0.3.1", cfg.getObject("sql"), new AsyncResultHandler<String>() {

        @Override
        public void handle(AsyncResult<String> res) {
          if (res.succeeded()) {
            startTests();
          } else {
            res.cause().printStackTrace();
          }
        }

      });
    } catch (DecodeException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
 
  }

  @Test
  public void loadKons() {
    ConsultationHandler ch = new ConsultationHandler(this);
    vertx.eventBus().registerHandler("ch.webelexis.test.kons", ch);
    vertx.setTimer(DELAY, new Handler<Long>() {

      @Override
      public void handle(Long arg0) {
        JsonObject lk = new JsonObject().putString("patid", "7ba4632caba62c5b3a366");
        vertx.eventBus().send("ch.webelexis.test.kons", lk, new Handler<Message<JsonObject>>() {

          @Override
          public void handle(Message<JsonObject> result) {
            VertxAssert.assertEquals("ok", result.body().getString("status"));
          }
        });
      }
    });

  }

}
