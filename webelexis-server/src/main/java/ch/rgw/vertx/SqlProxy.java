package ch.rgw.vertx;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.jdbc.JDBCClient;
import io.vertx.ext.sql.ResultSet;
import io.vertx.ext.sql.SQLConnection;

import java.util.List;
import java.util.logging.Logger;

/**
 * Created by gerry on 27.06.15.
 */
public class SqlProxy extends AbstractVerticle {

  JDBCClient client;
  Logger log = Logger.getLogger("SqlProxy");

  @Override
  public void start() {
    JsonObject cfg = config().getJsonObject("sql");
    client = JDBCClient.createShared(vertx, cfg);
    client.getConnection(cres -> {
      if (cres.succeeded()) {
        SQLConnection conn = cres.result();
        vertx.eventBus().consumer(cfg.getString("address"), msg -> {
          JsonObject query = (JsonObject) msg.body();
          switch (query.getString("action)")) {
            case "insert":

              break;
            case "prepared":
              conn.queryWithParams(query.getString("statement"), query.getJsonArray("values"), res -> {
                if (res.succeeded()) {
                  ResultSet result = res.result();
                  List<String> columnNames = result.getColumnNames();
                  List<JsonArray> results = result.getResults();
                  msg.reply(new JsonObject().put("status", "ok").put("rows", results.size())
                    .put("fields", new JsonArray(columnNames)).put("results", new JsonArray(results)));
                } else {
                  msg.reply(new JsonObject().put("status", "error").put("message", res.result()));
                }
              });
              break;
            default:
              msg.reply(new JsonObject().put("status", "error").put("message", "ollegal opcode " + query.encode()));
          }
        });
      } else {
        log.severe("Could not connect to SQL source");
      }
    });

  }

  @Override
  public void stop() {
    client.close();
  }
}
