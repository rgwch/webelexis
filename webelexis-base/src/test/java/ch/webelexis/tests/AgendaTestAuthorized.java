package ch.webelexis.tests;

import java.io.File;
import java.io.FileReader;

import org.junit.Test;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.testtools.TestVerticle;
import org.vertx.testtools.VertxAssert;

public class AgendaTestAuthorized extends TestVerticle {

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
		container.deployVerticle("ch.webelexis.CoreVerticle", cfg,
				new AsyncResultHandler<String>() {

					@Override
					public void handle(AsyncResult<String> event) {
						org.vertx.testtools.VertxAssert.assertTrue(event
								.succeeded());
						JsonObject jo = new JsonObject().putString("username",
								"user").putString("password", "pwd");
						EventBus eb = vertx.eventBus();
						eb.send("ch.webelexis.auth.login", jo, new IsLoggedIn());

					}
				});

	}

	class IsLoggedIn implements Handler<Message<JsonObject>> {

		@Override
		public void handle(Message<JsonObject> msg) {
			VertxAssert.assertEquals("ok", msg.body().getString("status"));
			String sessionID = msg.body().getString("sessionID");
			JsonObject jo = new JsonObject().putString("request", "list")
					.putString("token", sessionID)
					.putString("begin", "20150313")
					.putString("end", "20150313");
			vertx.eventBus().send("ch.webelexis.agenda", jo,
					new AgendaResponse());
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
