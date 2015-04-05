/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis;

import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.Handler;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.sockjs.EventBusBridgeHook;
import org.vertx.java.core.sockjs.SockJSSocket;

/**
 * Implement our own authentication and authorisation
 * @author gerry
 *
 */
public class EventBusHook implements EventBusBridgeHook {

	/**
	 * for now, we'll treat everyone as authorized
	 */
	@Override
	public boolean handleAuthorise(JsonObject message, String sessionID,
			Handler<AsyncResult<Boolean>> handler) {
			return true;
	}

	@Override
	public void handlePostRegister(SockJSSocket arg0, String arg1) {

	}

	@Override
	public boolean handlePreRegister(SockJSSocket arg0, String arg1) {
		return true;
	}

	@Override
	public boolean handleSendOrPub(SockJSSocket arg0, boolean arg1,
			JsonObject arg2, String arg3) {
		return true;
	}

	@Override
	public void handleSocketClosed(SockJSSocket arg0) {
	}

	@Override
	public boolean handleSocketCreated(SockJSSocket arg0) {
		return true;
	}

	@Override
	public boolean handleUnregister(SockJSSocket arg0, String arg1) {
		return true;
	}

}
