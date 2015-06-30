package ch.webelexis;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;

import java.io.File;
import java.io.FileWriter;
import java.io.InputStream;
import java.util.logging.Logger;

/**
 * Created by gerry on 27.06.15.
 */
public class Runner {
  public static void main(String[] args) {
    try {
      Logger log = Logger.getGlobal();
      Vertx vertx = Vertx.vertx();
      JsonObject cfg = new JsonObject();
      InputStream in = Runner.class.getResourceAsStream("../../config_defaults.json");
      if (in != null) {
        System.out.println("Running as files");
        cfg = Cleaner.createFromStream(in);
        in.close();
      } else {
        in = Runner.class.getResourceAsStream("/config_defaults.json");
        if (in != null) {
          System.out.println("running as jar");
          cfg = Cleaner.createFromStream(in);
          in.close();

        }
      }
      if ((args.length == 0) || (!new File(args[0]).exists())) {
        String enc = cfg.encodePrettily();
        FileWriter out = new FileWriter("cfglocal.json");
        out.write(enc);
        out.close();

      } else {

        JsonObject cfglocal = Cleaner.createFromFile(args[0]);
        cfg = cfg.mergeIn(cfglocal);

      }
      vertx.deployVerticle("ch.webelexis.CoreVerticle", new DeploymentOptions().setConfig(cfg));
    } catch (Exception ex) {
      System.out.print("usage: java -jar webelexis [<config>]\\n" + ex.getMessage());

    }

  }
}
