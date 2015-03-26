package ch.webelexis.agendatests;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({
	AgendaTestAnon.class,
	AgendaTestAuthorized.class
})
public class AgendaTestSuite {

}
