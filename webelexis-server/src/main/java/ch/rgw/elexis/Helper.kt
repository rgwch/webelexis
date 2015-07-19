package ch.rgw.elexis

import ch.rgw.tools.JdbcLink
import java.sql.PreparedStatement

/**
 * Created by gerry on 19.07.15.
 */

fun createPreparedStatement(j: JdbcLink, sql: String, vararg fields: String) : PreparedStatement{
  val pr=j.prepareStatement(sql)
  for(i in fields.indices){
    pr.setString(i+1,fields[i])
  }
  return pr
}