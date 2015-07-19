/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich.
 */

package ch.rgw.elexis

import ch.rgw.tools.JdbcLink
import ch.rgw.tools.StringTool
import ch.rgw.tools.TimeTool
import io.vertx.core.AbstractVerticle
import io.vertx.core.json.JsonObject
import java.io.IOException
import java.sql.SQLException
import java.util.Date

/**
 * Created by gerry on 07.07.15.
 */
public class Elexis private constructor() : AbstractVerticle() {
  private val cfg: JsonObject
  private var theInstance: Elexis? = null
  private val j: JdbcLink

  init {
    this.cfg = config().getJsonObject("sql")
    j = JdbcLink(cfg.getString("driver_class", "com.mysql.jdbc.Driver"), cfg.getString("url", "jdbc:mysql:localhost"), "default")
    if (!j.connect(cfg.getString("user", ""), cfg.getString("password", ""))) {

      throw RuntimeException("could not connect to elexis server: " + j.lastErrorString)
    }
  }

  throws(IOException::class)
  public fun getInstance(): Elexis {
    if (theInstance == null) {
      try {
        theInstance = Elexis()
      } catch (t: Throwable) {
        throw IOException("failed to create connection ", t.getCause())
      }

    }
    return theInstance!!
  }

  public fun getPatient(id: String): JsonObject? {
    return null
  }

  throws(SQLException::class)
  public fun addPatient(name: String, firstName: String, dob: String) {
    val sqlKontakt = "INSERT INTO KONTAKT (id,Bezeichnung1,Bezeichnung2,Geburtsdatum, istPatient,deleted,lastupdate) VALUES(?,?,?,?,?,?,?)"
    val patId = StringTool.unique("webelexis")
    val dobShort = TimeTool(dob).toString(TimeTool.DATE_COMPACT)
    val pK = createPreparedStatement(j, sqlKontakt, patId, name, firstName, dobShort, "0", "1");
    pK.setLong(7, Date().getTime())
    val res = pK.executeUpdate()
    if (res == 1) {
      val fallID = StringTool.unique("webelexis")
      val sqlFaelle = "INSERT INTO FAELLE (id, PatientID, DatumVon, deleted, lastupdate) VALUES(?,?,?,?,?)"
      val pF = createPreparedStatement(j, sqlFaelle, fallID, patId, TimeTool().toString(TimeTool.DATE_COMPACT), "0")
      pF.setLong(5, Date().getTime())
      val r2 = pF.executeUpdate()
      if (r2 == 1) {
        val consID = StringTool.unique("webelexis")
        val sqlKons = "INSERT INTO BEHANDLUNGEN (id,FallID,Datum,deleted,lastupdate) VALUES (?,?,?,?,?)"
        val pC = createPreparedStatement(j, sqlKons, consID, fallID, TimeTool().toString(TimeTool.DATE_COMPACT), "0")
        pC.setLong(5, Date().getTime())
        val r3 = pC.executeUpdate();
      }
    }
  }

}
