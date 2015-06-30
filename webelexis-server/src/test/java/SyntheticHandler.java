import io.vertx.core.Handler;
import io.vertx.core.Verticle;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class SyntheticHandler implements Handler<Message<JsonObject>> {
  JsonObject jo;
  MockVerticle v;
  long DELAY = 15l;
  int matched = 0;
  int unmatched = 0;

  SyntheticHandler(MockVerticle busmod, JsonObject config) {
    jo = config;
    this.v = busmod;
    busmod.getVertx().eventBus().consumer(jo.getString("listen-address"), this);
  }

  /**
   * Match the given message against all filter messages. Return match-reply on
   * first match. Return nomatch-reply if no message matches.
   * To simulate slower modules, there's a delay of at least DELAY ms before answer.
   */
  @Override
  public void handle(final Message<JsonObject> msg) {
    JsonObject m = msg.body();
    v.log.info("got message " + msg.body().encode());
    JsonArray matchers = jo.getJsonArray("match");
    for (Object o : matchers) {
      JsonObject cand = (JsonObject) o;
      boolean matchCase = cand.getBoolean("case-sensitive", false);
      v.log.fine("testing: " + cand.encode());
      if (doMatch(cand.getJsonObject("message"), m, matchCase)) {
        matched++;
        final JsonObject repl = cand.getJsonObject("match-reply");
        if (repl != null) {
          v.log.fine("matched. replying " + repl.encode());
          long delay = cand.getLong("delay", DELAY);
          v.getVertx().setTimer(delay, new Handler<Long>() {
            @Override
            public void handle(Long arg0) {
              msg.reply(repl);
            }

          });
        } else {
          v.log.warning("no reply found for matching message " + cand.encode());
        }
        return;
      }
    }
    unmatched++;
    v.log.warning("no matching template found! " + m.encode());
    JsonObject unmatched = jo.getJsonObject("nomatch-reply");
    if (unmatched != null) {
      v.log.fine("replying " + unmatched.encode());
      msg.reply(unmatched.put("offending", m));
    }
  }

  boolean doMatch(JsonObject src, JsonObject tgt, boolean matchCase) {
    if (src == null || tgt == null) {
      v.log.severe("bad format of mock descriptor string");
      return false;
    }
    Set<String> fields = src.fieldNames();
    for (String field : fields) {
      Object s = src.getValue(field);
      Object t = tgt.getValue(field);
      if (!matchObjects(s, t, matchCase)) {
        return false;
      }
    }
    return true;
  }

  boolean matchObjects(Object s, Object t, boolean matchCase) {
    if (t == null) {
      return false;
    }
    if (!s.getClass().equals(t.getClass())) {
      return false;
    }
    if (s instanceof JsonObject) {
      if (!doMatch((JsonObject) s, (JsonObject) t, matchCase)) {
        return false;
      }
    } else if (s instanceof Number) {
      if ((Number) s != (Number) t) {
        return false;
      }
    } else if (s instanceof String) {
      Pattern pattern = Pattern.compile((String) s, matchCase ? 0 : Pattern.CASE_INSENSITIVE);
      Matcher m = pattern.matcher((String) t);
      if (!m.matches()) {
        return false;
      }

    } else if (s instanceof JsonArray) {
      JsonArray sa = (JsonArray) s;
      JsonArray ta = (JsonArray) t;
      return matchArrays(sa, ta, matchCase);
    }
    return true;
  }

  boolean matchArrays(JsonArray a1, JsonArray a2, boolean matchCase) {
    if (a2.size() < a1.size()) {
      return false;
    }
    for (int i = 0; i < a1.size(); i++) {
      Object o1 = a1.getValue(i);
      Object o2 = a2.getValue(i);
      if (!matchObjects(o1, o2, matchCase)) {
        return false;
      }
    }
    return true;
  }
}
