/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich.
 */

package ch.rgw.elexis;

import ch.rgw.tools.StringTool;
import ch.rgw.vertx.Util;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.jdbc.JDBCClient;
import io.vertx.ext.sql.SQLConnection;

import java.io.IOException;

/**
 * Created by gerry on 07.07.15.
 */
public class Elexis extends AbstractVerticle {
  private JsonObject cfg;
  private JDBCClient client;
  private SQLConnection conn;
  private boolean bConnected;
  private Elexis theInstance;

  private Elexis() {
    this.cfg = config();
    client = JDBCClient.createShared(vertx, cfg.getJsonObject("sql"));
    client.getConnection(cres -> {
      if (cres.succeeded()) {
        bConnected = true;
        conn = cres.result();
      } else {
        throw new RuntimeException("could not connect to elexis server", cres.cause());
      }

    });
  }

  public Elexis getInstance() throws IOException {
    if (theInstance == null) {
      try {
        theInstance = new Elexis();
      } catch (Throwable t) {
        throw new IOException("failed to create connection ", t.getCause());
      }
    }
    return theInstance;
  }

  public JsonObject getPatient(String id) {
    return null;
  }

  public void addPatient(String name, String firstName, String dob) {
    conn.setAutoCommit(false, acRes -> {
      if (acRes.succeeded()) {
        String pid = StringTool.unique("webelexis");
        String sql = "INSERT INTO KONTAKT (id,Bezeichnung1,Bezeichnung2,Geburtsdatum, istPatient) VALUES(?,?,?,?)";
        conn.updateWithParams(sql, Util.asJsonArray(new String[]{name, firstName, dob, "1"}), pres -> {
          if (pres.succeeded()) {
            String sql2 = "INSERT INTO FAELLE (id";

          } else {
            conn.rollback(rbRes -> {
              conn.setAutoCommit(true, acres -> {
              });
            });
          }
        });
      }
    });
  }

}
