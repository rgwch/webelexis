/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

package ch.webelexis.agenda;

import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;

import java.util.logging.Logger;

class PrivateAgendaInsertHandler implements Handler<Message<JsonObject>> {
  final EventBus eb;
  final JsonObject cfg;
  Logger log = Logger.getLogger("PrivateAgendaInsertHandler");

  public PrivateAgendaInsertHandler(EventBus eb, JsonObject cfg) {
    this.eb = eb;
    this.cfg = cfg;
  }

  @Override
  public void handle(Message<JsonObject> arg0) {
    // TODO Auto-generated method stub

  }

}
