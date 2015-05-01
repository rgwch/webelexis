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
import ch.webelexis.agenda.PublicAgendaListHandler;

public class PublicAgendaListTest extends TestVerticle {
	JsonObject testDesc;
	EventBus eb;
	String AdminAddress;
	String AGENDA_LIST = "ch.webelexis.agenda.list";
	long DELAY = 50;

	public void start() {
		initialize();
		try {
			testDesc = Cleaner.createFromFile("src/test/publicagenda.json");
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
	public void listAppointments() {
		eb.registerHandler(AGENDA_LIST, new PublicAgendaListHandler(this, testDesc
					.getObject("agendaList")));
		vertx.setTimer(DELAY, new Handler<Long>() {

			@Override
			public void handle(Long arg0) {
				JsonObject listDay = testDesc.getObject("listDay");
				eb.send(AGENDA_LIST, listDay, new ListDayHandler());
			}
		});
	}

	class ListDayHandler implements Handler<Message<JsonObject>> {

		@Override
		public void handle(Message<JsonObject> msg) {
			VertxAssert.testComplete();
		}

	}
}