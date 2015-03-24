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

public class AgendaTest extends TestVerticle {

	
	@Test
	public void TestLoggedIn() throws Exception {
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
						JsonObject jo=new JsonObject()
							.putString("username", "user")
							.putString("password", "pwd");
						EventBus eb=vertx.eventBus();
						eb.send("ch.webelexis.auth.login",jo,new IsLoggedIn());
						
					}
				});

	}

	class IsLoggedIn implements Handler<Message<JsonObject>>{

		@Override
		public void handle(Message<JsonObject> msg) {
			VertxAssert.assertEquals("ok", msg.body().getString("status"));
			String sessionID=msg.body().getString("sessionID");
			JsonObject jo=new JsonObject()
				.putString("token", sessionID)
				.putString("begin", "20150313")
				.putString("end", "20150313");
			vertx.eventBus().send("ch.webelexis.agenda.appointments", jo, new AgendaResponse());
		}
		
	}
	
	class AgendaResponse implements Handler<Message<JsonObject>>{

		@Override
		public void handle(Message<JsonObject> msg) {
			VertxAssert.assertEquals("ok", msg.body().getString("status"));
			JsonObject apps=msg.body();
			System.out.println(apps.toString());
			VertxAssert.testComplete();
		}
		
	}
}
