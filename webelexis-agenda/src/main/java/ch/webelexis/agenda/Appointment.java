package ch.webelexis.agenda;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;

import org.vertx.java.core.json.JsonObject;

public class Appointment extends JsonObject {
	private static final long serialVersionUID = 8195440513391921833L;
	
	Appointment(){
		
	}
	
	public static List<Appointment> getAppointments(String fromDay, String untilDay, String resource){
		PreparedStatement ps=JdbcLink.getInstance().prepareStatement("Select * FROM AGNTERMINE Where Tag>='?' and Tag<= '?' and Bereich='?'");
		try {
			ps.setString(1, fromDay);
			ps.setString(2, untilDay);
			ps.setString(3, resource);
			List<Appointment> ret=new LinkedList<Appointment>();
			if(JdbcLink.getInstance().query(ps, ret)){
				return ret;
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
}
