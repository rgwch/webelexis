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

public class PatientDetailTest extends TestVerticle {
	String deploymentID;

	@Test
	public void TestRequest() throws Exception {
		File file = new File("cfglocal.json");
		char[] buffer = new char[(int) file.length()];
		FileReader fr = new FileReader(file);
		fr.read(buffer);
		fr.close();
		String conf = new String(buffer);
		VertxAssert.assertTrue(conf.length() > 0);
		JsonObject cfg = new JsonObject();
		try {
			cfg = new JsonObject(conf);
		} catch (Throwable t) {
			t.printStackTrace();
		}
		container.deployVerticle("ch.webelexis.CoreVerticle", cfg, new AsyncResultHandler<String>() {

			@Override
			public void handle(AsyncResult<String> event) {
				org.vertx.testtools.VertxAssert.assertTrue(event.succeeded());
				deploymentID = event.result();
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
			JsonObject jo = new JsonObject().putString("address", "ch.webelexis.patient")
					.putString("request", "summary").putString("patid", "7ba4632caba62c5b3a366")
					.putString("sessionID", sid);
			EventBus eb = vertx.eventBus();
			eb.send("ch.webelexis.patient", jo, new SqlAnswer());

		}

	}

	class SqlAnswer implements Handler<Message<JsonObject>> {

		@Override
		public void handle(Message<JsonObject> msg) {
			System.out.println("received sql result");
			VertxAssert.assertEquals("ok", msg.body().getString("status"));
			container.undeployVerticle(deploymentID);
			VertxAssert.testComplete();
			container.exit();
		}

	}

}
