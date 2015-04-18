package ch.webelexis.emr;

import java.util.HashMap;
import java.util.Map;

public class LabItem {
	
	public static LabItem getItem(String itemId){
		return null;
	}
	
	public static class LabItems{
		static Map<String, LabItem> items;
		public static LabItem getItem(String itemId){
			if(items==null){
				items=new HashMap<String, LabItem>();
				
			}
		}
	}
}
