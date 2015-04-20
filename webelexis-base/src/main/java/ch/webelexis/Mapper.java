package ch.webelexis;

import org.vertx.java.core.json.JsonObject;

public class Mapper {
	String[] fields;
	
	public Mapper(String[] fields){
		this.fields=fields;
	}
	
	public String mapToString(String input, String placement){
		StringBuilder sb=new StringBuilder();
		for(String f:fields){
			sb.append(f).append(",");
		}
		sb.replace(sb.length()-1, sb.length(), " ");
		return input.replaceFirst(placement, sb.toString());
	}
	
	public JsonObject mapToJson(Object[] values){
		JsonObject ret=new JsonObject();
		for(int i=0;i<fields.length;i++){
			String field=fields[i];
			int pt=field.indexOf('.');
			if(pt!=-1){
				field=field.substring(pt+1);
			}
			ret.putValue(field, values[i]);
		}
		return ret;
	}
}
