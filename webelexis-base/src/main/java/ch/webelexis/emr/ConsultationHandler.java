/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.emr;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import ch.webelexis.Cleaner;
import ch.webelexis.ParametersException;

public class ConsultationHandler implements Handler<Message<JsonObject>> {
	Verticle v;
	EventBus eb;
	Logger log;
	String[] fields=new String[]{"k.datum","k.diagnosen","k.eintrag"};
	final static String sql="select k.id, k.datum, k.diagnosen, k.eintrag from BEHANDLUNGEN as k, FAELLE as f, KONTAKT as ko where ko.id=? and f.patientid=ko.id and k.fallid=f.id and deleted='0'";

	
	public ConsultationHandler(Verticle server) {
		v = server;
		this.eb = v.getVertx().eventBus();
		this.log = v.getContainer().logger();
	}

	@Override
	public void handle(Message<JsonObject> externalRequest) {
		Cleaner cl=new Cleaner(externalRequest);
		try{
			final String patid=cl.get("patid", Cleaner.UID, false);
			JsonObject jo=new JsonObject().putString("action", "prepared")
			    .putString("statement", sql)
			    .putArray("values", new JsonArray(new String[]{patid}));
			log.debug("sending query "+jo.encodePrettily());
			eb.send("ch.webelexis.sql", jo,new SqlResult(cl));
		}catch(ParametersException pex){
			log.error(pex.getStackTrace());
			cl.replyError(pex.getMessage());
		}
	}

	class SqlResult implements Handler<Message<JsonObject>> {
    Cleaner cl;

    SqlResult(Cleaner c) {
      this.cl = c;
    }

    @Override
    public void handle(Message<JsonObject> sqlAnswer) {
      log.debug("LabReuslt: Got answer from sql server: " + sqlAnswer.body().encodePrettily());
      JsonObject result = sqlAnswer.body();
      cl.reply(result);
    }
  }

}
