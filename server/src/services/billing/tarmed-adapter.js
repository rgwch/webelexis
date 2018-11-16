const tarmed_class = "ch.elexis.data.TarmedLeistung"

/**
 * convert a tarmed billable into a billing
 * @param {} billable
 */
module.exports.createBilling=tm=>{
    const billing={
      behandlung:tm.encounter,
      leistg_text:tm.tx255,
      leistg_code:tm.code,
      klasse: tarmed_class,
      zahl: tm.count,
      ek_kosten:0,
      SCALE:100,
      SCALE2:100

    }
    return billing
}
