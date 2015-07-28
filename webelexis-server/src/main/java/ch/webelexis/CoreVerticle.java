/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich.
 */
package ch.webelexis;

import io.vertx.core.*;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.net.JksOptions;
import io.vertx.ext.web.Route;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.sockjs.BridgeOptions;
import io.vertx.ext.web.handler.sockjs.PermittedOptions;
import io.vertx.ext.web.handler.sockjs.SockJSHandler;


import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * The Webelexis core verticle deploys all needed verticles and sets
 * up the http- and sockjs-Servers. Configuration for all objects is taken from
 * a file called "config_defaults.json", that must be situated at the root
 * directory of the module. A second file, cfglocal.json in the same directory
 * should contain modifications for the actual setup. Options in cfglocal.json
 * will override those in config_defaults.json. It is <em>NOT</em> recommended
 * to modify config_defaults.json directly, since Webelexis updates will
 * overwrite this file (but not cfglocal.json).
 *
 * @author gerry
 */
public class CoreVerticle extends AbstractVerticle {
  final static long TIMEOUT = 60000;
  public static JsonObject rootConfig;
  public static final Logger log = Logger.getLogger("CoreVerticle");
  final ArrayList<String> pending = new ArrayList<>();
  Throwable reason = null;
  long waitingTime;

  /**
   * Enter all verticles to deploy here. Note: Webelexis will deploy
   * them asynchronously, so there is no guaranteed order for them to be ready.
   */

  final String[] verticles = new String[]{
    "ch.webelexis.agenda.Server",
    "ch.webelexis.account.Server",
    "ch.webelexis.emr.Server",
    "ch.rgw.vertx.SessionManager",
    "ch.rgw.vertx.MongoProxy",
    "ch.rgw.vertx.SqlProxy"
  };


  /*
   * Deploy every verticle defined in  verticles[].
   * Configuration of each object is the section with the matching
   * title-property. If a configuration contains a boolean "active", the value
   * of this boolean declares, if that object will be launched or not.
   *
   * @see org.vertx.java.platform.Verticle#start(io.vertx.core.Future)
   */
  @Override
  public void start(final Future<Void> startedResult) {
    Context ctx = vertx.getOrCreateContext();
    rootConfig = ctx.config();
    //String logResult= Json.encode(rootConfig);
    log.log(Level.FINE, "Starting CoreVerticle");
    log.finest("CoreVerticle got config: " + rootConfig.encodePrettily());


    for (String v : verticles) {
      log.fine("launching " + v);
      pending.add(v);
      vertx.deployVerticle(v, new DeploymentOptions().setConfig(rootConfig), new DeploymentHandler(v));
    }

		/*
         * now we wait for all verticles to launch successfully. Every
		 * 200ms we check, if the queue of pending launches is empty. This method
		 * seems a bit expensive, but since the server will not restart very
		 * frequently, it's okay.
		 */
    waitingTime = System.currentTimeMillis();
    vertx.setPeriodic(200, timerID -> {
      if (pending.isEmpty()) {
        vertx.cancelTimer(timerID);
        startedResult.complete();
      } else {
        if ((System.currentTimeMillis() - waitingTime) > TIMEOUT) {
          vertx.cancelTimer(timerID);
          startedResult.fail(new Exception("Timeout waiting for launching modules"));
        }
      }
      if (reason != null) {
        vertx.cancelTimer(timerID);
        startedResult.fail(reason);
      }
    });

    final JsonObject bridgeCfg = rootConfig.getJsonObject("bridge");
    HttpServerOptions options = new HttpServerOptions().setCompressionSupported(true);
    if (bridgeCfg.getBoolean("ssl", true)) {
      String keystorePath = bridgeCfg.getString("keystore", System.getProperty("user.home")
        + "/.jkeys/keystore.jks");
      JksOptions ksopt = new JksOptions().setPath(keystorePath).setPassword(bridgeCfg.getString("keystore-pwd"));
      options.setSsl(true).setKeyStoreOptions(ksopt);
    }
    HttpServer http = vertx.createHttpServer(options);
    Router router=Router.router(vertx);
    SockJSHandler sock = SockJSHandler.create(vertx);

    BridgeOptions bridgeOptions = new BridgeOptions();
    JsonArray inOk=bridgeCfg.getJsonArray("inOK");
    for(Object jo:inOk){
      bridgeOptions.addInboundPermitted(new PermittedOptions((JsonObject)jo));
    }
    for(Object jo:bridgeCfg.getJsonArray("outOK")){
      bridgeOptions.addOutboundPermitted(new PermittedOptions((JsonObject) jo));
    }
    sock.bridge(bridgeOptions);
    router.route("/eventbus/*").handler(sock);
    //router.routeWithRegex("\\/eventbus\\/.*").handler(sock);
    //Route eb=router.route().pathRegex(".*eventbus.*");
    // eb.handler(sock);
    HTTPHandler rootHandler=new HTTPHandler(bridgeCfg,vertx.eventBus());
    router.route().handler(routingContext ->{
      rootHandler.handle(routingContext.request());
    });
    http.requestHandler(router::accept).listen(bridgeCfg.getInteger("port"));
  }

  /**
   * The deployment handler adjusts the list of starting verticles and outputs messages on success ad failure
   */
  private class DeploymentHandler implements AsyncResultHandler<String> {
    final String t;

    DeploymentHandler(String title) {
      t = title;
    }

    @Override
    public void handle(AsyncResult<String> result) {
      pending.remove(t);
      if (result.succeeded()) {
        log.info("Deployed successfully: " + t);
      } else {
        reason = result.cause();
        log.severe("failed to deploy " + t + ": " + result.result());

      }
    }

  }

}
