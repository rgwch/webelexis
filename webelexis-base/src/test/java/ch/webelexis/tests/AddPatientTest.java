package ch.webelexis.tests;

import java.io.IOException;

import org.junit.Test;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.testtools.TestVerticle;
import org.vertx.testtools.VertxAssert;

import ch.webelexis.Cleaner;
import ch.webelexis.patient.AddPatientHandler;

public class AddPatientTest extends TestVerticle {
	JsonObject testDesc;
	EventBus eb;
	String AdminAddress;

	public void start() {
		initialize();
		try {
			testDesc = Cleaner.createFromFile("src/test/addpatient.json");
			JsonObject cfg = testDesc.getObject("config-mock");
			AdminAddress = cfg.getString("admin-address");
			eb = vertx.eventBus();
			// container.deployModule("rgwch~vertx-mod-mock~0.1.1", cfg, new
			// AsyncResultHandler<String>() {
			container.deployVerticle("ch.webelexis.Verticle", cfg, new AsyncResultHandler<String>() {

				@Override
				public void handle(AsyncResult<String> res2) {
					if (res2.succeeded()) {
						startTests();
					} else {
						res2.cause().printStackTrace();
					}
				}

			});
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	@Test
	public void runTest() {
		eb.send(AdminAddress, testDesc.getObject("mock-mongo"));
		eb.send(AdminAddress, testDesc.getObject("mock-sql"));
		eb.send(AdminAddress, testDesc.getObject("mock-mailer"));
		eb.registerHandler("ch.webelexis.patient.add", new AddPatientHandler(this, testDesc
					.getObject("config-addpatient")));
	
		vertx.setTimer(50, new Handler<Long>() {

			@Override
			public void handle(Long arg0) {
				JsonObject user1 = testDesc.getObject("testuser1");
				eb.send("ch.webelexis.patient.add", user1, new AddUser2Handler());
			}
		});
	}

	class AddUser2Handler implements Handler<Message<JsonObject>> {

		@Override
		public void handle(Message<JsonObject> msg) {
			VertxAssert.assertEquals("ok", msg.body().getString("status"));
			VertxAssert.testComplete();
		}

	}

	/*
	 * @Override public Logger getLog() { return getContainer().logger(); }
	 * 
	 * @Override public EventBus getEventBus() { return getVertx().eventBus(); }
	 */
}
