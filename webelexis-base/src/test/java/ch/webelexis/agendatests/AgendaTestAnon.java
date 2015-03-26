package ch.webelexis.agendatests;

import java.io.FileInputStream;

import org.junit.Test;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.testtools.TestVerticle;
import org.vertx.testtools.VertxAssert;

public class AgendaTestAnon extends TestVerticle{
    String deploymentID;
    
	@Test
	public void TestRequest() throws Exception {
		FileInputStream fis = new FileInputStream("cfglocal.json");
		byte[] buffer = new byte[5000];
		int len = fis.read(buffer);
		fis.close();
		String s = new String(buffer, 0, len, "utf-8");
		JsonObject cfg = new JsonObject(s);
		container.deployVerticle("src/main/resources/webelexis-core.js", cfg,
				new AsyncResultHandler<String>() {

					@Override
					public void handle(AsyncResult<String> event) {
						org.vertx.testtools.VertxAssert.assertTrue(event
								.succeeded());
						deploymentID=event.result();
						JsonObject jo = new JsonObject()
								.putString("address", "ch.webelexis.agenda")
								.putString("request", "list")
								.putString("resource", "gerry")
								.putString("begin", "20150324")
								.putString("end", "20150324");
						EventBus eb = vertx.eventBus();
						eb.send("ch.webelexis.agenda", jo, new SqlAnswer());

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
