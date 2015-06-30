/**
 * (c) 2015 by G. Weirich and published under the terms of the Eclipse Public License 1.0
 */

import ch.rgw.vertx.Util;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.eventbus.MessageConsumer;
import io.vertx.core.json.JsonObject;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;


public class MockVerticle extends AbstractVerticle {
  EventBus eb;
  Logger log = Logger.getLogger("MockVerticle");
  JsonObject cfg;
  Map<String, SyntheticHandler> handlers = new HashMap<String, SyntheticHandler>();
  MessageConsumer mc;

  public void start() {
    cfg = config();
    eb = vertx.eventBus();
    if (cfg == null) {
      log.severe("no admin address provided.");
    }
    mc = eb.consumer(cfg.getString("admin-address"), msgRaw -> {
      JsonObject mBody = (JsonObject) msgRaw.body();
      String task = mBody.getString("task");
      if (task.equals("reply")) {
        SyntheticHandler sh = new SyntheticHandler(MockVerticle.this, (JsonObject) mBody);
        handlers.put(mBody.getString("listen-address"), sh);
        msgRaw.reply(new JsonObject().put("status", "ok"));
      } else if (task.equals("stats")) {
        SyntheticHandler sh = getHandler(msgRaw);
        if (sh != null) {
          msgRaw.reply(new JsonObject().put("status", "ok")
            .put("matched", sh.matched).put("unmatched", sh.unmatched));
        }
      } else if (task.equals("unregister")) {
        SyntheticHandler sh = getHandler(msgRaw);
        if (sh != null) {
          mc.unregister();
        }
      } else {
        msgRaw.reply(new JsonObject().put("status", "error").put("message", "task " + task + " not recognized"));
      }
    });
  }

  SyntheticHandler getHandler(Message<Object> msg) {
    SyntheticHandler sh = handlers.get(Util.getParm("listen-address", (AsyncResult<Message<JsonObject>>) msg));
    if (sh == null) {
      msg.reply(new JsonObject().put("status", "error")
        .put("message", "not registered"));
    }
    return sh;
  }
}
