/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich.
 */

import ch.webelexis.Cleaner;
import io.vertx.core.Handler;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.unit.TestContext;

/**
 * Created by gerry on 07.07.15.
 */
public class TstConfig implements Handler<TestContext> {

  @Override
  public void handle(TestContext testContext) {
    try {
      JsonObject cfg = Cleaner.createFromFile("target/classes/config_defaults.json");
      testContext.assertNotNull(cfg);
    } catch (Exception e) {
      e.printStackTrace();
      testContext.fail(e.getMessage());
    }
  }
}
