/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
package ch.webelexis.account;

import org.vertx.java.busmods.BusModBase;
import org.vertx.java.core.json.JsonObject;

import ch.webelexis.AuthorizingHandler;

public class Server extends BusModBase {

	@Override
	public void start() {
		super.start();
		JsonObject cfg = container.config();
		String role = cfg.getString("role", "admin");
		getContainer().logger().debug("Account Server got config: " + cfg.encodePrettily());
		eb.registerHandler("ch.webelexis.patient.add", new AuthorizingHandler(this, role, new AddPatientHandler(this, cfg)));
		eb.registerHandler("ch.webelexis.patient.verify",
				new AuthorizingHandler(this, role, new VerifyAccountHandler(this)));
		eb.registerHandler("ch.webelexis.patient.forgotpwd", new AuthorizingHandler(this, role, new ForgotPwdHandler(this,
				cfg)));
		eb.registerHandler("ch.webelexis.patient.changepwd", new AuthorizingHandler(this, role, new ChangePwdHandler(this,
				cfg)));
	}

}
