package ch.webelexis.agenda;

import static ch.webelexis.Cleaner.ELEXISDATE;
import static ch.webelexis.Cleaner.MAIL;
import static ch.webelexis.Cleaner.TIME;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;
import ch.webelexis.account.UserDetailProvider;

public class PublicAgendaDeleteHandler implements Handler<Message<JsonObject>> {
	Verticle verticle;
	JsonObject cfg;
	
	public PublicAgendaDeleteHandler(Verticle v, JsonObject cfg) {
		this.cfg=cfg;
		verticle=v;
	}
	
	@Override
	public void handle(Message<JsonObject> externalMsg) {
		final Cleaner cl=new Cleaner(externalMsg);
		try {
			final String username=cl.get("username", MAIL, false);
			final String day=cl.get("day", ELEXISDATE, false);
			final String time=cl.get("begin", TIME, false);
			new UserDetailProvider(verticle).getUser(username, new Handler<JsonObject>(){

				@Override
				public void handle(JsonObject userMsg) {
					JsonObject op=new JsonObject()
					.putString("action", "prepared")
					.putString("statement", "DELETE from AGNTERMINE where PatID=? and Tag=? and Beginn=?")
					.putArray("values",new JsonArray(new String[]{userMsg.getString("patientid"),day,time}));
					verticle.getVertx().eventBus().send("ch.webelexis.sql", op, new Handler<Message<JsonObject>>(){

						@Override
						public void handle(Message<JsonObject> sqlAnswer) {
							if(sqlAnswer.body().getString("status").equals("ok")){
								cl.replyOk();
							}else{
								verticle.getContainer().logger().error(sqlAnswer.body().encodePrettily());
								cl.replyError("database error SQL");
							}
						}});
				}
				
			});
		} catch (ParametersException e) {
			e.printStackTrace();
			cl.replyError();
		}
		
		
	}

}
