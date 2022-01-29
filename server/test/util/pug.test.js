const compiler=require('../../src/util/compile-pug')
const path=require('path')

const meta={
  testing: true,
  sitename: "Praxis Webelexis",
  admin: "someone@webelexis.ch",
  mandators: {
    default: {
      name: "Dr. med. Dok Tormed",
      street: "Hinterdorf 17",
      place: "9999 Webelexikon",
      phone: "555 55 55",
      email: "doc@webelexis.org",
      zsr: "G088113",
      gln: "123456789012"
    }
  },
  docbase:"../data/sample-docbase"
}
describe('pug template converter',()=>{
  it('compiles rezept.pug into rezept.html',()=>{
    const basedir=path.join(meta.docbase,"templates")
    console.log(path.resolve(basedir))
    meta.brieftype="Rezept"
    meta.mandator=meta.mandators.default
    compiler(basedir,'rezept.pug',meta)
  })
})
