
const ElexisUtils=require('../../src/util/elexis-types')
const should = require('chai').should();
const elexis=new ElexisUtils()

xdescribe("Elexis-specific utility functions",()=>{
  it("converts an elexis date into a standard Date String",()=>{
    let local=elexis.makeLocalFromCompact("20180818")
    local.should.equal('18.08.2018')
  })
  it("converts a standard date string to a elexis compact",()=>{
    let compact=elexis.makeCompactFromLocal("18.8.2018")
    compact.should.equal("20180818")
  })
  it("creates an elexis time stamp from a Date()",()=>{
    const date=new Date()
    const minutes=Math.round(date.getTime()/60000)
    const ets=elexis.elexisTimeStamp(date)
    ets.should.equal(minutes.toString())
  })
  it("converts between local date strings and Date()",()=>{
    const date="23.4.2017"
    const dob=elexis.makeDateObjectFromLocal(date)
    dob.should.be.a('Date')
    const check=elexis.makeCompactFromDateObject(dob)
    check.should.equal(elexis.makeCompactFromLocal(date))
  })
  it("converts between time strings and minutes",()=>{
    const mins=elexis.makeMinutes("08:05")
    mins.should.be.a('number')
    mins.should.equal(8*60+5)
    const mstr=elexis.makeTime(mins)
    mstr.should.equal("08:05")
  })
  it("convert between JSON and ExtInfo",()=>{
    const test={
      "a":"foo",
      "b":20,
      "c":{
        "x":1,
        "y":"2",
        "z": [1,2,3]
      },
      "d":["a","b","c"]
    }
    const exi=elexis.writeExtInfo(test)
    const restored=elexis.getExtInfo(exi)
    test.should.deep.equal(restored)
  })
  it("handles VersionedResources",()=>{
    const vr=elexis.createVersionedResource()
    const vr2=elexis.updateVersionedResource(vr,"Hello, Elexis","an entry from Webelexis")
    const cnt=elexis.getVersionedResource(vr2)
    cnt.should.not.be.undefined
    cnt.text.should.equal("Hello, Elexis")
    cnt.remark.should.equal("an entry from Webelexis")
    cnt.version.should.equal(0)
    const vr3=elexis.updateVersionedResource(vr,"Bye,Elexis","second entry from Webelexis")
    const cnt2=elexis.getVersionedResource(vr3)
    cnt2.text.should.equal("Bye,Elexis")
    cnt2.remark.should.equal("second entry from Webelexis")
  })
})
