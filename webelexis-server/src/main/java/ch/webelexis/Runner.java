/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich.
 */

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
 * (1) load default configuration
 * (2) try to find local configuraton:
 * (2a) filename given as parameter
 * (2b) file "cfglocal.json" in current directoy
 * (3) Merge local configuration into default configuration
 * (4) Launch Webelexis CoreVerticle with resulting configuration
 */
public class Runner {
  public static void main(String[] args) {
    try {
      Logger log = Logger.getGlobal();
      Vertx vertx = Vertx.vertx();
      JsonObject cfg = new JsonObject();
      // load default configuration
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
      // check if local config was given as argument
      if ((args.length > 0) && (new File(args[0]).exists())) {
        JsonObject cfglocal = Cleaner.createFromFile(args[0]);
        cfg = cfg.mergeIn(cfglocal);

      }
      // Check if local configuration file exists
      else if (new File("cfglocal.json").exists()) {
        cfg = cfg.mergeIn(Cleaner.createFromFile("cfglocal.json"));

      } else {
        //  create local configuration file from default configuration
        String enc = cfg.encodePrettily();
        FileWriter out = new FileWriter("cfglocal.json");
        out.write(enc);
        out.close();
        System.out.println("Configuration written. Please edit cfglocal.json and restart");
        System.exit(0);
      }

      vertx.deployVerticle("ch.webelexis.CoreVerticle", new DeploymentOptions().setConfig(cfg));
    } catch (Exception ex) {
      System.out.print("usage: java -jar webelexis [<config>]\\n" + ex.getMessage());

    }

  }
}
