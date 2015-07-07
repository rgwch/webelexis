/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich.
 */

import ch.rgw.tools.VersionedResource;
import io.vertx.core.Handler;
import io.vertx.ext.unit.TestContext;

/**
 * Created by gerry on 07.07.15.
 */
public class TstVersionedResource implements Handler<TestContext> {
  String up = "lorem ipsum solicisse purgatur";

  @Override
  public void handle(TestContext testContext) {
    try {
      VersionedResource vr = VersionedResource.load(null);
      testContext.assertTrue(vr.update(up, "one"));
      byte[] one = vr.serialize();
      VersionedResource v2 = VersionedResource.load(one);
      testContext.assertEquals(v2.getHead(), up);
    } catch (Exception e) {
      e.printStackTrace();
      testContext.fail(e.getMessage());
    }

  }
}
