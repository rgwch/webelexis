package ch.webelexis.agenda;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedList;
import java.util.List;

import org.vertx.java.core.json.JsonObject;

public class JdbcLink {
	Connection j;
	private static JdbcLink theInstance;
	
	public static JdbcLink getInstance(){
		return theInstance;	
	}
	
	
	JdbcLink(JsonObject config) throws Exception{
		String drivername=config.getString("dbDriver", "com.mysql.jdbc.Driver");
		String connectstring=config.getString("dbConnect", "jdbc:mysql://localhost:3306/elexis");
		String dbUser=config.getString("dbUser", "elexisuser");
		String dbPwd=config.getString("dbPwd","elexis");
		/* Driver driver= */ Class.forName(drivername).newInstance();
		j= DriverManager.getConnection(connectstring, dbUser, dbPwd);
		theInstance=this;
	}
	
	PreparedStatement prepareStatement(String sql){
		try {
			return j.prepareStatement(sql);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	boolean query(PreparedStatement stm, List ret){
		ResultSet rs=null;
		try {
			rs=stm.executeQuery();
			ResultSetMetaData rsm=rs.getMetaData();
			int cc=rsm.getColumnCount();
			while(rs.next()){
				JsonObject jo=new JsonObject();
				for(int i=1;i<=cc;i++){
					jo.putString(rsm.getColumnName(i), rs.getString(i));
				}
				ret.add(jo);
			}
			
				
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}finally{
			if(rs!=null){
				try {
					rs.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if(stm!=null){
				try {
					stm.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		return true;
	}
	
	List<JsonObject> query(String sql){
	
		LinkedList<JsonObject> ret=new LinkedList<JsonObject>();
		ResultSet rs=null;
		Statement stm=null;
		try {
			stm=j.createStatement();
			rs=stm.executeQuery(sql);
			ResultSetMetaData rsm=rs.getMetaData();
			int cc=rsm.getColumnCount();
			while(rs.next()){
				JsonObject jo=new JsonObject();
				for(int i=1;i<=cc;i++){
					jo.putString(rsm.getColumnName(i), rs.getString(i));
				}
				ret.add(jo);
			}
			
				
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			if(rs!=null){
				try {
					rs.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if(stm!=null){
				try {
					stm.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		return ret;
	}
}
