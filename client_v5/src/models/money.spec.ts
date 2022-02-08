import { Money } from './money'

describe('Money', () => {
  it('can be constructed from a number', () => {
    const m = new Money(5025)
    expect(m.getValue()).toEqual(50.25)
    expect(m.getFormatted()).toEqual("50.25")
 })
  it('cam be constructed from a string', () => {
    const m = new Money('30.35')
    expect(m.getValue()).toEqual(30.35)
    expect(m.getFormatted()).toEqual("30.35")
    const m1 = new Money('42,48')
    expect(m1.getValue()).toEqual(42.48)
    expect(m1.getFormatted()).toEqual("42.48")
  })
  it("rounds to the nearest 5 cents",()=>{
      const m=new Money(2013)
      expect(m.round5().getFormatted()).toEqual("20.15")
      const m1=new Money(2016)
      expect(m1.round5().getFormatted()).toEqual("20.15")
      const m2=new Money(2018)
      expect(m2.round5().getFormatted()).toEqual("20.20")
      const m3=new Money(2012)
      expect(m3.round5().getFormatted()).toEqual("20.10")
  })
  it("formats correctly",()=>{
    const m1=new Money(1015)
    expect(m1.getFormatted()).toEqual("10.15")
    const m2=new Money(10015)
    expect(m2.getFormatted()).toEqual("100.15")
    const m3=new Money(115)
    expect(m3.getFormatted()).toEqual("1.15")
    const m4=new Money(15)
    expect(m4.getFormatted()).toEqual("0.15")
    const m5=new Money(0)
    expect(m5.getFormatted()).toEqual("0.00")
  })
})
