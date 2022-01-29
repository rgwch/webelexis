import { Money } from './money'

describe('Money', () => {
  it('can be constructed from a number', () => {
    const m = new Money(50.25)
    expect(m.getValue()).toEqual(50.25)
    expect(m.getFormatted()).toEqual("50.25")
    const m1 = new Money(3000)
    expect(m1.getValue()).toEqual(30)
    expect(m1.getFormatted()).toEqual("30.00")
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
      const m=new Money(20.13)
      expect(m.round5().getFormatted()).toEqual("20.15")
      const m1=new Money(20.16)
      expect(m1.round5().getFormatted()).toEqual("20.15")
      const m2=new Money(20.18)
      expect(m2.round5().getFormatted()).toEqual("20.20")
      const m3=new Money(20.12)
      expect(m3.round5().getFormatted()).toEqual("20.10")


  })
})
