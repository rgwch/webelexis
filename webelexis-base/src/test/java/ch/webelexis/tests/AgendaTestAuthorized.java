package ch.webelexis.tests;

import java.io.File;
import java.io.FileReader;

import org.junit.Test;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.testtools.TestVerticle;
import org.vertx.testtools.VertxAssert;

public class AgendaTestAuthorized extends TestVerticle {
	String resource;

	@Test
	public void TestLoggedIn() throws Exception {
		File file = new File("cfglocal.json");
		char[] buffer = new char[(int) file.length()];
		FileReader fr = new FileReader(file);
		fr.read(buffer);
		fr.close();
		String conf = new String(buffer);
		VertxAssert.assertTrue(conf.length() > 0);
		JsonObject cfg = new JsonObject(conf);
		JsonArray resources = cfg.getObject("agenda").getObject("private").getArray("resources");
		JsonObject primary=resources.get(0);
		resource=primary.getString("resource","");
		container.deployVerticle("ch.webelexis.CoreVerticle", cfg, new AsyncResultHandler<String>() {

			@Override
			public void handle(AsyncResult<String> event) {
				org.vertx.testtools.VertxAssert.assertTrue(event.succeeded());
				final EventBus eb = vertx.eventBus();
				eb.send("ch.webelexis.session.create", new JsonObject(), new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> auth) {
						String sid = auth.body().getString("sessionID");
						JsonObject jo = new JsonObject().putString("username", "user").putString("password", "pwd")
								.putString("sessionID", sid);

						eb.send("ch.webelexis.session.login", jo, new IsLoggedIn(sid));

					}
				});

			}
		});

	}

	class IsLoggedIn implements Handler<Message<JsonObject>> {
		String sid = "";

		IsLoggedIn(String sid) {
			this.sid = sid;
		}

		@Override
		public void handle(Message<JsonObject> msg) {
			VertxAssert.assertEquals("ok", msg.body().getString("status"));
			JsonObject jo = new JsonObject().putString("request", "list").putString("sessionID", sid)
					.putString("resource", resource).putString("begin", "20150313").putString("end", "20150313");
			vertx.eventBus().send("ch.webelexis.privateagenda", jo, new AgendaResponse());
		}

	}

	class AgendaResponse implements Handler<Message<JsonObject>> {

		@Override
		public void handle(Message<JsonObject> msg) {
			VertxAssert.assertEquals("ok", msg.body().getString("status"));
			JsonObject apps = msg.body();
			System.out.println(apps.toString());
			VertxAssert.testComplete();
		}

	}
}
