/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis;

import io.vertx.core.*;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.json.DecodeException;
import io.vertx.core.json.JsonObject;
import io.vertx.core.net.JksOptions;
import io.vertx.ext.web.handler.sockjs.BridgeOptions;
import io.vertx.ext.web.handler.sockjs.PermittedOptions;
import io.vertx.ext.web.handler.sockjs.SockJSHandler;


import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.logging.Logger;

/**
 * The Webelexis core verticle deploys all needed modules and verticles and sets
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
    JsonObject cfg_default;
    public static Logger log = Logger.getLogger("CoreVerticle");
    ArrayList<String> pending = new ArrayList<String>();
    Throwable reason = null;
    long waitingTime;

    /**
     * Enter all verticles to deploy here. Note: Webelexis will deploy
     * them asynchronously, so there is no guaranteed order for them to be ready.
     */

    V[] verticles = new V[]{new V("agenda", "ch.webelexis.agenda.Server"),
            new V("account", "ch.webelexis.account.Server"), new V("emr", "ch.webelexis.emr.Server")
            , new V("auth", "ch.rgw.vertx.SessionManager")};

    public CoreVerticle() throws IOException {

        InputStream in = getClass().getResourceAsStream("config_defaults.json");
        if (in == null) {
            System.out.print("config_defaults.json not found. Trying alternative");
            File file = new File("src/main/resources/config_sample.json"); // IDE
            // mode
            if (!file.exists()) {
                System.out.print(file.getAbsolutePath() + " not found. Fatal exit");
                System.exit(-1);
            } else {
                in = new FileInputStream(file);
            }
        }
        try {
            cfg_default = Cleaner.createFromStream(in);
        } catch (DecodeException ex) {
            System.out.println("Invalid config json");
        }
        File cwd = new File(".");
        System.out.print("CWD in CoreVerticle: " + cwd.getAbsolutePath());
    }

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
        rootConfig = cfg_default.mergeIn(config());
        log.finest("CoreVerticle got config: " + rootConfig.encodePrettily());


        for (V v : verticles) {
            JsonObject moduleConfig = rootConfig.getJsonObject(v.title);
            if (moduleConfig.getBoolean("active", true)) {
                pending.add(v.title);
                vertx.deployVerticle(v.fullname, new DeploymentOptions().setConfig(moduleConfig), new DeploymentHandler(v.title));
            }
        }

		/*
         * now we wait for all verticles to launch successfully. Every
		 * 200ms we check, if the queue of pending launches is empty. This method
		 * seems a bit expensive, but since the server will not restart very
		 * frequently, it's okay.
		 */
        waitingTime = System.currentTimeMillis();
        vertx.setPeriodic(200, new Handler<Long>() {

            @Override
            public void handle(Long timerID) {
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

        http.requestHandler(new HTTPHandler(bridgeCfg, vertx.eventBus()));
        SockJSHandler sock = SockJSHandler.create(vertx);
        BridgeOptions bridgeOptions = new BridgeOptions();
        //PermittedOptions pop=new PermittedOptions();
        // bridgeOptions.setInboundPermitted(bridgeCfg.getJsonArray("inOK"));
        sock.bridge(bridgeOptions);
        http.listen(bridgeCfg.getInteger("port"));
    }

    private class DeploymentHandler implements AsyncResultHandler<String> {
        String t;

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

    private class V {
        V(String t, String f) {
            title = t;
            fullname = f;
        }

        String title;
        String fullname;
    }
}
