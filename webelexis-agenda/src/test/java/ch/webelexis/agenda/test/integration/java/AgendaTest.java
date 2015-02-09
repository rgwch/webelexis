package ch.webelexis.agenda.test.integration.java;

import org.junit.Test;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.testtools.TestVerticle;

public class AgendaTest extends TestVerticle {

	@Test
	public void TestGetAppointments(){
		
		JsonObject config=new JsonObject();
		config.putString("dbConnect", "jdbc:mysql://192.168.0.1:3306/elexis");
		config.putString("dbDriver", "com.mysql.jdbc.Driver");
		
		container.deployVerticle("ch.webelexis.agenda.DBAccess", new AsyncResultHandler<String>() {

			@Override
			public void handle(AsyncResult<String> event) {
				if(event.succeeded()){
				EventBus eb=vertx.eventBus();
				JsonObject msg=new JsonObject();
				msg.putString("begin", "20150101");
				msg.putString("end", "20150110");
				msg.putString("resource", "gerry");
				eb.send("ch.webelexis.agenda.appointments", msg, new Handler<Message<JsonArray>>(){

					@Override
					public void handle(Message<JsonArray> event) {
						System.out.println(event.body().size());
					}});
				}else{
					event.cause().printStackTrace();
					org.vertx.testtools.VertxAssert.assertEquals(1,0);
				}
			}
		});
	}
}
