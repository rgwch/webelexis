package ch.webelexis.agenda;

import org.vertx.java.core.Handler;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

public class Appointment extends JsonObject implements Comparable<Appointment>{
	private static final long serialVersionUID = 8195440513391921833L;
	// A.Tag,A.Beginn,A.Dauer, A.PatID, K.Bezeichnung1,K.Bezeichnung2,A.TerminTyp,A.TerminStatus,A.Grund from AGNTERMINE as A, KONTAKT as K where K.id=A.PatID and Tag>=? and Tag <=? and Bereich=? and A.deleted='0'")
	static final String STATEMENT1="SELECT Bezeichnung1,Bezeichnung2,geschlecht,Geburtsdatum FROM KONTAKT where id=?";
	
	Appointment(){}
	Appointment(JsonObject su) {
		super(su.toMap());
	}
	
	void load(JsonArray ja){
		String patId=ja.get(3);
		if(patId.matches("[a-zA-Z0-9][a-f0-9]{15,30}")){
			PersonaliaHandler handler=new PersonaliaHandler(this);
			
		}
	
		putString("Tag",(String)ja.get(0));
		putString("von",(String)ja.get(1));
		int bis= Integer.parseInt(getString("von"))+Integer.parseInt((String)ja.get(2));
		putString("bis",Integer.toString(bis));
	}

	@Override
	public int compareTo(Appointment o) {
		String myday=getString("day");
		String oday=o.getString("day");
		if(myday.equals(oday)){
			int mymin=getInteger("begin");
			int omin=o.getInteger("begin");
			return mymin-omin;
		}else{
			return myday.compareTo(oday);
		}
	}

	class PersonaliaHandler implements Handler<JsonObject>{
		Appointment app;
		
		PersonaliaHandler(Appointment app){
			this.app=app;
		}
		@Override
		public void handle(JsonObject event) {
			
		}
		
	}
}
