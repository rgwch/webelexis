const assert = require('assert');
const app = require('../../src/app');
const Gapfinder=require('../../src/services/schedule/gapfinder')
require('chai').should()

xdescribe('schedule', () => {
  describe('schedule gapfinder', ()=>{
    const gapf=new Gapfinder()
    const a=[5,10]
    const b=[2,5]
    const c=[11,15]
    const d=[4,6]
    const e=[9,13]
    const f=[4,11]
    const g=[6,8]
    const h=[3,5]
    const i=[10,15]

    it('checks overlaps',()=>{
      gapf.overlaps(a,a).should.be.true
      gapf.overlaps(a,b).should.be.false
      gapf.overlaps(b,a).should.be.false
      gapf.overlaps(a,c).should.be.false
      gapf.overlaps(c,a).should.be.false
      gapf.overlaps(a,d).should.be.true
      gapf.overlaps(d,a).should.be.true
      gapf.overlaps(a,e).should.be.true
      gapf.overlaps(e,a).should.be.true
      gapf.overlaps(a,f).should.be.true
      gapf.overlaps(f,a).should.be.true
      gapf.overlaps(a,g).should.be.true
      gapf.overlaps(g,a).should.be.true
      gapf.overlaps(a,h).should.be.false
      gapf.overlaps(h,a).should.be.false
      gapf.overlaps(a,i).should.be.false
      gapf.overlaps(i,a).should.be.false
      gapf.overlaps(b,h).should.be.true
      gapf.overlaps(h,b).should.be.true
    })

    it("deduplicates an array",()=>{
      (gapf.dedup(undefined)==undefined).should.be.true
      gapf.dedup([]).should.eql([])
      const dedupl=gapf.dedup([a,d,c,g,b,f,f,g,h,i])
      dedupl.length.should.equal(1)
      dedupl[0].should.eql([2,15])
      const dd2=gapf.dedup([a,c,b,f,[20,22]])
      dd2.length.should.equal(3)
    })

    it("finds gaps in an array of intervals",()=>{
      const gaps=gapf.findgaps([b,d,e,i,[19,21]])
      gaps.length.should.equal(2)
    })
  })


  describe('schedule service',()=>{
    it('registered the service', () => {
      const service = app.service('schedule');

      assert.ok(service, 'Registered the service');
    });
    it("loads appointments", async () => {
      const sched = app.service('schedule')
      const agn = app.service('termin')
      const resources = await agn.get('resources')
      const found = await sched.find({ query: { date: "20190110", resource: resources[0] } })
      found.should.be.an('Array')
    })

  })
  describe('schedule mailmaker',()=>{
    const{DateTime} = require('luxon')
    const dt=DateTime.fromFormat("20190422","yyyyLLdd")
    const tstart=dt.plus({minutes:550})
    console.log(tstart.toJSDate())
    const ical=require('ical-generator')
    const cal=ical({domain: "Test",name: "Arzttermin"})
    cal.method('publish').prodId({
      company: "Praxis Breite",
      product: "Terminvereinbarung",
      language: "DE"
    }).createEvent({
        start: tstart.toJSDate(),
        end: tstart.plus({minutes:20}).toJSDate(),
        description: "Arzttermin ",
        location: "Hier",
        timezone: "Europe/Zurich"
    })
    console.log(cal.toString())
  })
});

