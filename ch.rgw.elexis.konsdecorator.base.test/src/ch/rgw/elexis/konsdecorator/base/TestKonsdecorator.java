package ch.rgw.elexis.konsdecorator.base;

import java.util.ArrayList;
import java.util.List;

import junit.framework.Assert;
import scala.collection.JavaConversions;
import scala.collection.Seq;

import org.junit.Test;

public class TestKonsdecorator {
	static String toParse="Line one without special meaning\nidentifier: this is the first segment to match. And then, at anyPositionToMatch follows the second segment.";
	
	@Test
	public void test() {
		List<Decoration> decorations=new ArrayList<Decoration>();
		decorations.add(new Segment("Name of the segment", "identifier:"));
		decorations.add(new Segment("Just another Segment type", "anyPositionToMatch"));
		decorations.add(new Segment("Won't find in Test String", "doesnt Matter"));
		Scanner scanner=new Scanner(decorations,toParse);
		Seq<Segment> decs= scanner.getSegments();
		Assert.assertEquals(decs.size(), 2);
		System.out.println(decs.size());
	}

}
