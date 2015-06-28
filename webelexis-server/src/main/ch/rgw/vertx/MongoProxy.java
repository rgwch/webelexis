package ch.rgw.vertx;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

/**
 * Created by gerry on 27.06.15.
 */
public class MongoProxy extends AbstractVerticle {

  MongoClient mongo;
  JsonObject cfg;

  @Override
  public void start() {
    cfg = config().getJsonObject("mongo", new JsonObject());
    mongo = MongoClient.createShared(vertx, cfg);
    vertx.eventBus().consumer(cfg.getString("address"), msg -> {
      JsonObject cmd = (JsonObject) msg.body();
      switch (cmd.getString("action")) {
        case "update": {
          mongo.update(cmd.getString("collection"), cmd.getJsonObject("criteria"), cmd.getJsonObject("objNew"), res -> {
            if(res.succeeded()){
              msg.reply(new JsonObject().put("status","ok"));
            }else{
              msg.reply(new JsonObject().put("status", "error").put("message", res.result()));
            }
          });
        }
        break;
        case "save":
          mongo.save(cmd.getString("collection"), cmd.getJsonObject("document"), res -> {
            if (res.succeeded()) {
              JsonObject ret = new JsonObject().put("status", "ok").put("_id", res.result());
              msg.reply(ret);
            } else {
              msg.reply(new JsonObject().put("status", "error").put("message", res.result()));
            }
          });
          break;
        case "findone":
          mongo.findOne(cmd.getString("collection"), cmd.getJsonObject("matcher"), new JsonObject(), res -> {
            if (res.succeeded()) {
              msg.reply(new JsonObject().put("status", "ok").put("result", res.result()));
            } else {
              msg.reply(new JsonObject().put("status", "error").put("message", res.result()));
            }
          });
          break;
        case "delete":
          mongo.removeOne(cmd.getString("collection"),cmd.getJsonObject("matcher"),res->{
            if(res.succeeded()){
              msg.reply(new JsonObject().put("status","ok"));
            }else{
              msg.reply(new JsonObject().put("status","error").put("message",res.result()));
            }
          });
        default:
          msg.reply(new JsonObject().put("status", "error").put("message", "illegal opcode " + cmd.encode()));
      }
    });
  }
}
