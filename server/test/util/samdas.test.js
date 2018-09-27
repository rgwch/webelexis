const samdas = require('../../src/util/samdas')
const should = require('chai').should();

const source='<?xml version="1.0" encoding="UTF-8"?> \
<samdas:EMR xmlns:samdas="http://www.elexis.ch/XSD"><samdas:record><samdas:text>Lorem Ipsum er rett og slett dummytekst fra og for trykkeindustrien. Lorem Ipsum har vært bransjens standard for dummytekst helt siden 1500-tallet, da en ukjent boktrykker stokket en mengde bokstaver for å lage et prøveeksemplar av en bok. Lorem Ipsum har tålt tidens tann usedvanlig godt, og har i tillegg til å bestå gjennom fem århundrer også tålt spranget over til elektronisk typografi uten vesentlige endringer. Lorem Ipsum ble gjort allment kjent i 1960-årene ved lanseringen av Letraset-ark med avsnitt fra Lorem Ipsum, og senere med sideombrekkingsprogrammet Aldus PageMaker som tok i bruk nettopp Lorem Ipsum for dummytekst. \
[ 17.07.2008 Anmeldung Facharzt Du ]</samdas:text><samdas:xref from="634" length="37" provider="ch.elexis.text.DocXRef" id="8ba40287470e078bda799" /></samdas:record></samdas:EMR>'

describe("convert from and to samdas",()=>{

  it("converts a samdas text to plaintext",async ()=>{
    const plain=await samdas.plaintext(source)
    plain.should.be.ok
  })

  xit("converts samdas to html",()=>{


  })

  xit("converts plaintext to samdas",()=>{

  })

  xit("converts html to samdas",()=>{

  })

})
