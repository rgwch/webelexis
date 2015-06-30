/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.unit.Async;
import io.vertx.ext.unit.TestOptions;
import io.vertx.ext.unit.TestSuite;
import io.vertx.ext.unit.report.ReportOptions;

/**
 * Created by gerry on 26.06.15.
 */
public class BasicTest {


  public static void main(String[] args) {
    new BasicTest().testRun();
  }

  static Vertx vertx;
  static String MOCK="ch.rgw.testing.mock";


  public void testRun(){
    TestSuite suite = TestSuite.create("Webelexis Server");
    suite.before(ctx -> {
      vertx=Vertx.vertx();
      DeploymentOptions dop=new DeploymentOptions().setConfig(new JsonObject().put("admin-address",MOCK));
      Async async=ctx.async();
      vertx.deployVerticle("MockVerticle",dop,res -> {
        ctx.assertTrue(res.succeeded());
        ctx.put("mockID",res.result());
        async.complete();
      });
    });

    suite.after(ctx -> {
      vertx.undeploy(ctx.get("mockID"),res-> {
        ctx.assertTrue(res.succeeded());
      });
    });
    /*
    suite.test("test", context -> {
      Vertx vertx = Vertx.vertx();
      JsonObject config = new JsonObject().put("a", "b");
      config.encodePrettily();
      vertx.deployVerticle("ch.webelexis.CoreVerticle", new DeploymentOptions().setConfig(config));
      String s = "hallo";
      context.assertEquals(s, "hallo");
    });
    */
    suite.test("captcha", new TstCaptcha());
    suite.run(new TestOptions().addReporter(new ReportOptions().setTo("console")));
  }

}
