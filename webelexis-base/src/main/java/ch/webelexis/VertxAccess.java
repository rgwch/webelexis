package ch.webelexis;

import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.logging.Logger;

public interface VertxAccess {

	public Logger getLog();
	public EventBus getEventBus();
}
