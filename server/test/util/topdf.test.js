const fs=require('fs')
const path=require('path')
const doctool=require('../../src/util/topdf')
const should = require('chai').should();

describe("toPDF creates PDF documents",()=>{
  it("merges a template and a document",()=>{
    const template=fs.readFileSync(path.join(__dirname,"../../src/services/documents/example-template.html"))
    const doc={
      concern: {
        Bezeichnung1: "Testperson",
        Bezeichnung2: "Armeswesen",
        Geburtsdatum: "19700115",
        Anschrift: "Lange Gasse 17, 5555 Webelexikon"
      },
      addressee: {
        Bezeichnung1: "Konsularius",
        Bezeichnung2: "Konsulus",
        Salutation: "Lieber Konsi",
        Anschrift: "Kurze Allee 28, 5555 Webelexikon"
      },
      subject: "a test",
      type: "doc",
      template: "template",
      contents: "<h1>Lorem Ipsum</h1><p>Perseveratur ut liquidmum</p>"
    }
    const merged=doctool.merge(template.toString(),doc)
  })
})
