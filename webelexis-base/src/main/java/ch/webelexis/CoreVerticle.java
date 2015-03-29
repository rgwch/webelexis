/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;

import org.vertx.java.busmods.BusModBase;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.Handler;
import org.vertx.java.core.http.HttpServer;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.core.sockjs.EventBusBridgeHook;
import org.vertx.java.core.sockjs.SockJSServer;
import org.vertx.java.core.sockjs.SockJSSocket;

public class CoreVerticle extends BusModBase {
	JsonObject cfg_default;
	JsonObject cfg;
	Logger log;

	V[] modules = new V[] {
			new V("sql", "io.vertx~mod-mysql-postgresql_2.10~0.3.1"),
			new V("mongo", "io.vertx~mod-mongo-persistor~2.1.0") };
	V[] verticles = new V[] { new V("auth", "ch.rgw.vertx.AuthManager"),
			new V("agenda", "ch.webelexis.agenda.Server") };

	public CoreVerticle() throws IOException {
		File file = new File("config_defaults.json");
		char[] buffer = new char[(int) file.length()];
		FileReader fr = new FileReader(file);
		/* int num= */fr.read(buffer);
		fr.close();
		cfg_default = new JsonObject(new String(buffer));
	}

	@Override
	public void start() {
		log=container.logger();
		cfg = cfg_default.mergeIn(container.config());

		for (V m : modules) {
			container.deployModule(m.fullname, cfg.getObject(m.title),
					new DeploymentHandler(m.title));
		}
		for (V v : verticles) {
			container.deployVerticle(v.fullname, new DeploymentHandler(v.title));
		}
		
		HttpServer http=vertx.createHttpServer();
		SockJSServer sock=vertx.createSockJSServer(http);
		sock.bridge(null,null,null);
		sock.setHook(null);
	}

	private class DeploymentHandler implements AsyncResultHandler<String> {
		String t;
		
		DeploymentHandler(String title){
			t=title;
		}
		@Override
		public void handle(AsyncResult<String> result) {
			if(result.succeeded()){
				log.info("Deployed successfully: "+t);
			}else{
				log.fatal("failed to deploay "+t+": "+result.result(), result.cause());
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
