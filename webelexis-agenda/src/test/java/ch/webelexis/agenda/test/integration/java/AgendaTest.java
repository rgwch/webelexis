package ch.webelexis.agenda.test.integration.java;

import java.io.FileInputStream;

import org.junit.Test;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.testtools.TestVerticle;
import static org.vertx.testtools.VertxAssert.*;


public class AgendaTest extends TestVerticle {

	@Test
	public void TestGetAppointments() throws Exception{

		FileInputStream fis=new FileInputStream("conf.json");
		byte[] buffer=new byte[5000];
		int len=fis.read(buffer);
		fis.close();
		String s=new String(buffer,0,len,"utf-8");
		JsonObject cfg=new JsonObject(s);
		container.deployVerticle("ch.webelexis.agenda.Server",cfg,
				new AsyncResultHandler<String>() {

					@Override
					public void handle(AsyncResult<String> event) {
						org.vertx.testtools.VertxAssert.assertTrue(event
								.succeeded());
						EventBus eb = vertx.eventBus();
						JsonObject msg = new JsonObject();
						msg.putString("begin", "20150101");
						msg.putString("end", "20150110");
						msg.putString("resource", "gerry");
						eb.send("ch.webelexis.agenda.appointments", msg,
								new Handler<Message<JsonObject>>() {

									@Override
									public void handle(Message<JsonObject> event) {
										assertEquals("ok",event.body().getString("status"));
										JsonArray results=event.body().getArray("results");
										assertTrue(results.size()>0);
										testComplete();
									}
								});
					}
				});
	}
}
