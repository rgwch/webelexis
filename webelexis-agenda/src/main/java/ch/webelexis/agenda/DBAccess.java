package ch.webelexis.agenda;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

public class DBAccess extends Verticle {
	
	@Override
	public void start(){
		EventBus eb=vertx.eventBus();
		Handler<Message<JsonObject>> handler=new Handler<Message<JsonObject>>(){

			@Override
			public void handle(Message<JsonObject> event) {
				String from=event.body().getString("begin");
				String until=event.body().getString("end");
				String resource=event.body().getString("resource");
				event.reply(Appointment.getAppointments(from, until, resource));
			}
			
		};
		eb.registerHandler("ch.webelexis.agenda.appointments", handler);
	}
}
