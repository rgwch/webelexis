/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const article_class = "ch.artikelstamm.elexis.common.ArtikelstammItem"

module.exports.createBilling = async (art, app) => {
  const billing = {
    leistg_txt: art.dscr,
    leistg_code: art.gtin || art.phar,
    klasse: article_class,
    zahl: art.count.toString(),
    ek_kosten: Math.round(art.pexf*100),
    vk_tp: Math.round(art.ppub*100),
    scale: "100",
    scale2: "100"
  }
  return billing
}
