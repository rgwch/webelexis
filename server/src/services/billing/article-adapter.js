const article_class = "ch.artikelstamm.elexis.common.ArtikelstammItem"

module.exports.createBilling = async (art, app) => {
  const billing = {
    leistg_txt: art.DSCR,
    leistg_code: art.GTIN || art.PHAR,
    klasse: article_class,
    zahl: art.count.toString(),
    ek_kosten: art.PEXF,
    VK_TP: art.PPUB,
    SCALE: "100",
    SCALE2: "100"
  }
  return billing
}
