package ch.webelexis.tests;

import java.io.IOException;

import org.junit.Test;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.json.JsonObject;
import org.vertx.testtools.TestVerticle;
import org.vertx.testtools.VertxAssert;

import ch.webelexis.BusJob;
import ch.webelexis.Cleaner;

// doesn't work single threaded
public class BusJobTest extends TestVerticle {
	JsonObject testDesc;
	EventBus eb;
	String AdminAddress;
	String BUSJOB="ch.webelexis.busjob";
	long DELAY=50;

	public void start() {
		initialize();
		try {
			testDesc = Cleaner.createFromFile("src/test/busjob.json");
			JsonObject cfg = testDesc.getObject("config-mock");
			AdminAddress = cfg.getString("admin-address");
			eb = vertx.eventBus();
			container.deployModule("rgwch~vertx-mod-mock~0.2.0", cfg, new AsyncResultHandler<String>() {
				// container.deployVerticle("ch.webelexis.Verticle", cfg, new
				// AsyncResultHandler<String>() {

				@Override
				public void handle(AsyncResult<String> res2) {
					if (res2.succeeded()) {
						JsonObject conf=testDesc.getObject("mock-busjob");
						VertxAssert.assertNotNull(conf);
						eb.send(AdminAddress, conf);
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
	public void testExisting(){
		BusJob job=new BusJob(this,BUSJOB,testDesc.getObject("should_answer"));
		JsonObject result=job.getIfOk(5000);
		VertxAssert.assertNotNull(result);
		VertxAssert.assertEquals("ok", result.getString("status"));
		VertxAssert.assertEquals("bar",result.getString("foo"));
		VertxAssert.testComplete();
	}
	@Test
	public void testInxisting(){
		BusJob job=new BusJob(this,BUSJOB,testDesc.getObject("should_not_answer"));
		long start=System.currentTimeMillis();
		JsonObject result=job.getIfOk(200);
		long end=System.currentTimeMillis();
		
		VertxAssert.assertNull(result);
		VertxAssert.assertTrue(Math.abs(end-start-200)<50);
		VertxAssert.testComplete();
	}
	
}