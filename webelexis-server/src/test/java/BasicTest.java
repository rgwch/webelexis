/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich.
 */

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.unit.Async;
import io.vertx.ext.unit.TestCompletion;
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
      Async async = ctx.async();
      vertx.undeploy(ctx.get("mockID"), res -> {
        ctx.assertTrue(res.succeeded());
        async.complete();
      });
    });
    suite.test("config", new TstConfig());
    suite.test("VersionedResource", new TstVersionedResource());
    suite.test("captcha", new TstCaptcha());

    TestCompletion completion=suite.run(new TestOptions().addReporter(new ReportOptions().setTo("console")));
    completion.awaitSuccess(5000l);
    System.exit(0);
  }

}
