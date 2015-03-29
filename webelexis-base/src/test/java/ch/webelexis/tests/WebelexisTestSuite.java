package ch.webelexis.tests;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({
	CoreVerticleTest.class,
	AgendaTestAnon.class,
	AgendaTestAuthorized.class
})
public class WebelexisTestSuite {

}
