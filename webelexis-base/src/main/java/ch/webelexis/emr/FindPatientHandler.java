/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.emr;

import ch.webelexis.Cleaner;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

/**
 * Created by gerry on 14.06.15.
 */
public class FindPatientHandler implements Handler<Message<JsonObject>> {
    Verticle server;

    public FindPatientHandler(Verticle server) {
        this.server = server;

    }

    @Override
    public void handle(Message<JsonObject> externalEvent) {
        Cleaner cl = new Cleaner(externalEvent);

    }


}
