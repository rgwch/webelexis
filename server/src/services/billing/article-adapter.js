/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const article_class = "ch.artikelstamm.elexis.common.ArtikelstammItem"

module.exports.createBilling = async (art, app) => {
  const billing = {
    leistg_txt: art.DSCR,
    leistg_code: art.GTIN || art.PHAR,
    klasse: article_class,
    zahl: art.count.toString(),
    ek_kosten: Math.round(art.PEXF*100),
    VK_TP: Math.round(art.PPUB*100),
    SCALE: "100",
    SCALE2: "100"
  }
  return billing
}
