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

public class AgendaTestAnon extends TestVerticle {
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
		JsonObject cfg = new JsonObject(conf);
		container.deployVerticle("ch.webelexis.CoreVerticle", cfg,
				new AsyncResultHandler<String>() {

					@Override
					public void handle(AsyncResult<String> event) {
						org.vertx.testtools.VertxAssert.assertTrue(event
								.succeeded());
						deploymentID = event.result();
						JsonObject jo = new JsonObject()
								.putString("address", "ch.webelexis.publicagenda")
								.putString("request", "list")
								.putString("resource", "gerry")
								.putString("begin", "20150324")
								.putString("end", "20150324");
						EventBus eb = vertx.eventBus();
						eb.send("ch.webelexis.publicagenda", jo, new SqlAnswer());

					}
				});

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
