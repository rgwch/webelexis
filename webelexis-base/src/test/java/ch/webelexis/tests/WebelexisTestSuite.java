package ch.webelexis.tests;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({
	CoreVerticleTest.class,
	ConfigFileChecker.class,
	AddPatientTest.class,
	PublicAgendaListTest.class,
	PublicAgendaInsertTest.class,
	PublicAgendaDeleteTest.class,
	LabValueTest.class
})
public class WebelexisTestSuite {

}
