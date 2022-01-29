export class Money {
  private cents: number = 0

  constructor(initial: number | string) {
    if (typeof initial === 'number') {
      if (Math.floor(initial) === initial) {
        this.cents = Math.round(initial * 100) / 100
      } else {
        this.cents = Math.round(initial * 10000) / 100
      }
    } else {
      this.cents = this.string2number(initial)
    }
  }
  number2string(n: number) {
    return Math.round(n * 100).toString()
  }
  string2number(s: string): number {
    let parts = s.split('.')
    if (parts.length == 1) {
      parts = s.split(',')
    }
    const base: number = parseInt(parts[0])
    const frac: number = parts.length > 1 ? parseInt(parts[1]) : 0
    return base * 100 + frac
  }
  getValue(): number {
    return this.cents / 100
  }
  getFormatted(): string {
    const s = this.cents.toString()
    const f = s.substring(0, s.length - 2)
    const c = s.substring(s.length - 2)
    return f + '.' + c
  }
  round5(): Money {
    const rounded = Math.round(this.getValue() * 20) / 20
    return new Money(rounded)
  }
}
