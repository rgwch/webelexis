/**
 * (c) 2015 by G. Weirich
 */
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

/**
 * Send a request via eventbus (ch.webelexis.agenda.appointments) and receive
 * appointments
 * 
 * @author gerry
 * 
 */
public class AgendaTest extends TestVerticle {
	String insert_user="{'action': 'save', 'collection': 'users','document': {'username': 'chubby','password': 'wibble'}}";

	@Test
	public void TestGetAppointments() throws Exception {

		FileInputStream fis = new FileInputStream("conf.json");
		byte[] buffer = new byte[5000];
		int len = fis.read(buffer);
		fis.close();
		String s = new String(buffer, 0, len, "utf-8");
		JsonObject cfg = new JsonObject(s);
		container.deployVerticle("ch.webelexis.agenda.Server", cfg,
				new AsyncResultHandler<String>() {

					@Override
					public void handle(AsyncResult<String> event) {
						org.vertx.testtools.VertxAssert.assertTrue(event
								.succeeded());
						EventBus eb = vertx.eventBus();
						JsonObject user=new JsonObject(insert_user.replaceAll("\'", "\""));
						eb.send("ch.webelexis.nosql", user);
						doLogin("false", "password");
						JsonObject msg = new JsonObject();
						msg.putString("begin", "20150101");
						msg.putString("end", "20150110");
						msg.putString("resource", "gerry");
						msg.putString("token", "blubb");
						eb.send("ch.webelexis.agenda.appointments", msg,
								new Handler<Message<JsonObject>>() {

									@Override
									public void handle(Message<JsonObject> event) {
										assertEquals("ok", event.body()
												.getString("status"));
										JsonArray results = event.body()
												.getArray("results");
										assertTrue(results.size() > 0);
									}
								});
						doLogin("chubby","wibble");
							}

				});
	}

	private String doLogin(String user, String pwd) {
		final EventBus eb = vertx.eventBus();
		eb.send("ch.webelexis.auth.login",
				new JsonObject().putString("username", user).putString(
						"password", pwd), new Handler<Message<JsonObject>>() {

							@Override
							public void handle(Message<JsonObject> event) {
								if(event.body().getString("status").equals("ok")){
									JsonObject msg = new JsonObject();
									msg.putString("begin", "20150101");
									msg.putString("end", "20150110");
									msg.putString("resource", "gerry");
									msg.putString("token", event.body().getString("sessionID"));
									eb.send("ch.webelexis.agenda.appointments", msg,
											new Handler<Message<JsonObject>>() {

												@Override
												public void handle(Message<JsonObject> event) {
													assertEquals("ok", event.body()
															.getString("status"));
													JsonArray results = event.body()
															.getArray("results");
													assertTrue(results.size() > 0);
													testComplete();
												}
											});

								}
							}

				});
		return null;
	}
}
