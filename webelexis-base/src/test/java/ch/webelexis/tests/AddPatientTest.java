package ch.webelexis.tests;

import java.io.IOException;

import org.junit.Test;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.json.JsonObject;
import org.vertx.testtools.TestVerticle;

import ch.webelexis.Cleaner;
import ch.webelexis.patient.AddPatientHandler;

public class AddPatientTest extends TestVerticle {
	JsonObject testDesc;
	EventBus eb;
	
	
	public void start() {
		initialize();
		try {
			testDesc = Cleaner.createFromFile("src/test/addpatient.json");
			JsonObject cfg = testDesc.getObject("config-mock");
			eb=vertx.eventBus();
			container.deployVerticle("rgwch~vertx-mod-mock~0.1.1", cfg, new AsyncResultHandler<String>() {

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
	public void runTest(){
		eb.registerHandler("ch.webelexis.patient.add", new AddPatientHandler(this, testDesc.getObject("config-addpatient")));
	}

	/*
	@Override
	public Logger getLog() {
		return getContainer().logger();
	}

	@Override
	public EventBus getEventBus() {
		return getVertx().eventBus();
	}
	*/
}
