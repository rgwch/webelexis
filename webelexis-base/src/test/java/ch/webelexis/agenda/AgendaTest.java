package ch.webelexis.agenda;

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
		JsonObject cfg = new JsonObject();
		container.deployVerticle("webelexis-core.js", cfg,
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
			VertxAssert.assertEquals("ok", msg.body().getString("result"));
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
		public void handle(Message<JsonObject> arg0) {
			// TODO Auto-generated method stub
			
		}
		
	}
}
