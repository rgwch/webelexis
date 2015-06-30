/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

/**
 * This file is part of Webelexis
 * (c) 2015 by G. Weirich
 */
package ch.webelexis.agenda;

import ch.webelexis.AuthorizingHandler;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;

import java.util.logging.Logger;

/**
 * The main Verticle of Webelexis-Agenda.
 *
 * @author gerry
 */
class Server extends AbstractVerticle {
  private static final Logger log = Logger.getLogger("AgendaServer");

  @Override
  public void start() {
    // load the configuration as given to 'vertx -conf <config-file>'
    EventBus eb = vertx.eventBus();
    // final JsonObject aCfg=cfg.getObject("agenda");
    final JsonObject pubCfg = config().getJsonObject("timeslots");
    final JsonObject priCfg = config().getJsonObject("agenda");
    final PublicAgendaListHandler publiclistHandler = new PublicAgendaListHandler(this, pubCfg);
    final PublicAgendaInsertHandler publicinsertHandler = new PublicAgendaInsertHandler(this, pubCfg);
    final PublicAgendaDeleteHandler publicdeletehandler = new PublicAgendaDeleteHandler(this, pubCfg);
    final PrivateAgendaListHandler privateListHandler = new PrivateAgendaListHandler(eb, priCfg);
    final PrivateAgendaInsertHandler privateInsertHandler = new PrivateAgendaInsertHandler(eb, priCfg);


    // Register handlers with the eventBus
    eb.consumer("ch.webelexis.publicagenda", new AuthorizingHandler(this, pubCfg.getString("role"),
      msg -> {
        String req = msg.body().getString("request");
        log.info("Agenda public Server: received : " + req);
        if (req.equals("list")) {
          publiclistHandler.handle(msg);
        } else if (req.equals("insert")) {
          publicinsertHandler.handle(msg);
        } else if (req.equals("delete")) {
          publicdeletehandler.handle(msg);
        }
      }));
    eb.consumer("ch.webelexis.privateagenda", new AuthorizingHandler(this, priCfg.getString("role"),
      msg -> {
        String req = msg.body().getString("request");
        log.info("Agenda private Server: received : " + req);
        if (req.equals("list")) {
          privateListHandler.handle(msg);
        } else if (req.equals("insert")) {
          privateInsertHandler.handle(msg);
        } else if (req.equals("resources")) {
          JsonObject result = new JsonObject().put("status", "ok").put("data",
            priCfg.getJsonArray("resources"));
          log.finest("answering: " + result.encodePrettily());
          msg.reply(result);
        }

      }));

  }
}
