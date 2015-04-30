/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.account;

import org.vertx.java.busmods.BusModBase;
import org.vertx.java.core.json.JsonObject;

import ch.webelexis.AuthorizingHandler;

public class Server extends BusModBase {
	static final String MAILER = "io.vertx~mod-mailer~2.0.0-final";

	@Override
	public void start() {
		super.start();
		JsonObject cfg = container.config();
		getContainer().logger().debug("Account Server got config: " + cfg.encodePrettily());
		eb.registerHandler("ch.webelexis.patient.add", new AuthorizingHandler(this, cfg.getString(
					"role", "admin"), new AddPatientHandler(this, cfg)));
		eb.registerHandler("ch.webelexis.patient.verify", new AuthorizingHandler(this, cfg.getString(
					"role", "admin"), new VerifyAccountHandler(this)));
		eb.registerHandler("ch.webelexis.patient.forgotPwd", new AuthorizingHandler(this, cfg
					.getString("role", "admin"), new ForgotPwdHandler(this, cfg)));
	}

}
