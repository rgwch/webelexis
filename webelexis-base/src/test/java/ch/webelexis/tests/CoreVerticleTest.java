package ch.webelexis.tests;

import java.io.File;
import java.io.FileReader;

import org.junit.Test;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.json.JsonObject;
import org.vertx.testtools.TestVerticle;
import org.vertx.testtools.VertxAssert;

public class CoreVerticleTest extends TestVerticle {
	JsonObject cfg;
	
	@Test
	public void LaunchCoreVerticle() throws Exception{
		File file = new File("cfglocal.json");	
		char[] buffer = new char[(int) file.length()];
		FileReader fr = new FileReader(file);
		fr.read(buffer);
		fr.close();
		String conf=new String(buffer);
		VertxAssert.assertTrue(conf.length()>0);
		cfg = new JsonObject(conf);
		container.deployVerticle("ch.webelexis.CoreVerticle", cfg, new AsyncResultHandler<String>() {

			@Override
			public void handle(AsyncResult<String> result) {
				VertxAssert.assertTrue(result.succeeded());
				VertxAssert.testComplete();
			}
		});
	}
}
