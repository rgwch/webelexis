import ch.webelexis.Cleaner;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.unit.TestContext;

import java.io.IOException;

/**
 * Created by gerry on 30.06.15.
 */
public class TestCaptcha implements Handler<TestContext> {

  @Override
  public void handle(TestContext testContext){
    try {
      JsonObject config= Cleaner.createFromFile("TestCaptcha.json");
      Vertx vertx= Vertx.vertx();
      vertx.deployVerticle("MockVerticle",new DeploymentOptions().setConfig(config),run -> {
        testContext.assertTrue(run.succeeded());
      });
    } catch (IOException e) {
      e.printStackTrace();
      testContext.fail("Error loading config");
    }
  }
}
