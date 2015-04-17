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
import ch.webelexis.agenda.PublicAgendaInsertHandler;

public class PublicAgendaInsertTest extends TestVerticle {
	JsonObject testDesc;
	EventBus eb;
	String AdminAddress;
	String AGENDA_INSERT = "ch.webelexis.agenda.insert";
	long DELAY = 50;

	public void start() {
		initialize();
		try {
			testDesc = Cleaner.createFromFile("src/test/publicagenda.json");
			JsonObject cfg = testDesc.getObject("config-mock");
			AdminAddress = cfg.getString("admin-address");
			eb = vertx.eventBus();
			container.deployModule("rgwch~vertx-mod-mock~0.2.0", cfg, new AsyncResultHandler<String>() {
				// container.deployVerticle("ch.webelexis.Verticle", cfg, new
				// AsyncResultHandler<String>() {

				@Override
				public void handle(AsyncResult<String> res2) {
					if (res2.succeeded()) {
						eb.send(AdminAddress, testDesc.getObject("mock-sql"));
						eb.send(AdminAddress, testDesc.getObject("mock-nosql"));
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
	public void insertAppointment() {
		eb.registerHandler(AGENDA_INSERT, new PublicAgendaInsertHandler(this, testDesc.getObject("agendaList")));
		vertx.setTimer(DELAY, new Handler<Long>() {

			@Override
			public void handle(Long arg0) {
				JsonObject insert = testDesc.getObject("insertApp");
				eb.send(AGENDA_INSERT, insert, new InsertAppntHandler());
			}
		});
	}

	class InsertAppntHandler implements Handler<Message<JsonObject>> {

		@Override
		public void handle(Message<JsonObject> msg) {
			VertxAssert.assertEquals("ok", msg.body().getString("status"));
			VertxAssert.testComplete();
		}

	}

}
