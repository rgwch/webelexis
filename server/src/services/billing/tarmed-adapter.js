/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const tarmed_class = "ch.elexis.data.TarmedLeistung"
const ElexisUtils = require('../../util/elexis-types')
const util = new ElexisUtils()

/**
 * convert a tarmed billable into a billing
 * @param {} billable
 */
module.exports.createBilling = async (tm, app) => {
  const knex = app.get("knexClient")
  const ext = await knex('tarmed_extension').where("code", tm.id)
  let tl = 0.0
  let al = 0.0
  if (Array.isArray(ext) && ext.length>0) {
    const limits = util.getExtInfo(ext[0].limits)
    tl = parseFloat(limits.tp_tl)
    al = parseFloat(limits.tp_al)
  }
  const billing = {
    leistg_txt: tm.tx255,
    leistg_code: tm.id,
    klasse: tarmed_class,
    zahl: tm.count.toString(),
    vk_tp: Math.round(100 * (tl + al)).toString(),
    scale: "100",
    scale2: "100"

  }
  return billing
}
