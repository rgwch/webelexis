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
import ch.webelexis.emr.LabResultSummaryHandler;

public class LabValueTest extends TestVerticle {
	JsonObject testDesc;
	EventBus eb;
	String AdminAddress;
	String REQUEST_ADDRESS = "ch.webelexis.emr.labvalues";
	long DELAY = 50;

	public void start() {
		initialize();
		try {
			testDesc = Cleaner.createFromFile("src/test/labresults.json");
			JsonObject cfg = testDesc.getObject("config-mock");
			AdminAddress = cfg.getString("admin-address");
			eb = vertx.eventBus();
			container.deployModule("rgwch~vertx-mod-mock~0.3.1", cfg, new AsyncResultHandler<String>() {

				@Override
				public void handle(AsyncResult<String> res2) {
					if (res2.succeeded()) {
						eb.send(AdminAddress, testDesc.getObject("mock-sql"));
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
	public void LabValueCall() {
		eb.registerHandler(REQUEST_ADDRESS, new LabResultSummaryHandler(this));
		vertx.setTimer(DELAY, new Handler<Long>() {

			@Override
			public void handle(Long arg0) {
				JsonObject listDay = testDesc.getObject("request");
				VertxAssert.assertNotNull(listDay);
				eb.send(REQUEST_ADDRESS, listDay, new LabRequestHandler());
			}
		});

	}

	class LabRequestHandler implements Handler<Message<JsonObject>> {

		@Override
		public void handle(Message<JsonObject> answer) {
			VertxAssert.assertEquals("ok", answer.body().getString("status"));
			VertxAssert.testComplete();
		}

	}
}
