import ch.webelexis.Cleaner;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.unit.Async;
import io.vertx.ext.unit.TestContext;

import java.io.IOException;

/**
 * Created by gerry on 30.06.15.
 */
public class TstCaptcha implements Handler<TestContext> {

  @Override
  public void handle(TestContext testContext){
    try {
      JsonObject config= Cleaner.createFromFile("target/test-classes/TestCaptcha.json");
      Async async=testContext.async();
      BasicTest.vertx.deployVerticle("ch.rgw.vertx.CaptchaVerticle",new DeploymentOptions().setConfig(config),run -> {
        testContext.assertTrue(run.succeeded());
        final String captchaID=run.result();
        System.out.println("captcha verticle started");
        Async async2=testContext.async();
        BasicTest.vertx.undeploy(captchaID, res->{
          testContext.assertTrue(res.succeeded());
          async2.complete();
        });
        async.complete();
      });
    } catch (IOException e) {
      e.printStackTrace();
      testContext.fail("Error loading config");
    }
  }
}
