package ch.webelexis.agenda;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.vertx.java.platform.PlatformLocator;
import org.vertx.java.platform.PlatformManager;


public class Activator implements BundleActivator {
	PlatformManager pm;

	@Override
	public void start(BundleContext context) throws Exception {
		pm = PlatformLocator.factory.createPlatformManager();
		pm.deployWorkerVerticle(true, arg1, arg2, arg3, arg4, arg5, arg6);
		pm.deployVerticle(arg0, arg1, arg2, arg3, arg4, arg5);
	}

	@Override
	public void stop(BundleContext context) throws Exception {
		pm.undeployAll(null);
	}

}
