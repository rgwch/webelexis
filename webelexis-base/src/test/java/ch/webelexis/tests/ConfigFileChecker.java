package ch.webelexis.tests;

import java.io.IOException;

import static org.junit.Assert.*;
import org.junit.Test;
import org.vertx.java.core.json.DecodeException;
import org.vertx.java.core.json.JsonObject;

import ch.webelexis.Cleaner;

/**
 * Check various json files for formal correctness
 * @author gerry
 *
 */
public class ConfigFileChecker{

		@Test
		public void checkcfgTest() throws DecodeException, IOException{
			JsonObject cfg=Cleaner.createFromFile("src/main/resources/config_sample.json");
			assertNotNull(cfg);
		}
		
		@Test
		public void checkCfgMinimal() throws  DecodeException, IOException{
			JsonObject cfg=Cleaner.createFromFile("src/main/resources/config_minimal.json");
			assertNotNull(cfg);
		}
		
		@Test
		public void checkCfgLocal() throws  DecodeException, IOException{
			JsonObject cfg=Cleaner.createFromFile("cfglocal.json");
			assertNotNull(cfg);
		}
		
		@Test
		public void checkAddPatient() throws  DecodeException, IOException{
			JsonObject cfg=Cleaner.createFromFile("src/test/addpatient.json");
			assertNotNull(cfg);
		}
		
		@Test
		public void checkMooduleDescriptor() throws  DecodeException, IOException{
			JsonObject cfg=Cleaner.createFromFile("src/main/resources/mod.json");
			assertNotNull(cfg);
		}
		
}

