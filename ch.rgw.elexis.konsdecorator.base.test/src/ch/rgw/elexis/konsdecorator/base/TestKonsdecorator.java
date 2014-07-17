package ch.rgw.elexis.konsdecorator.base;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

public class TestKonsdecorator {

	@Test
	public void test() {
		List<Decoration> decorations=new ArrayList<Decoration>();
		DecoratedKons k=new DecoratedKons((scala.collection.immutable.List<Decoration>) decorations);
		decorations.add(new Segment("Rather complicated name", "shorter Label"));
	}

}
