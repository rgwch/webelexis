/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

export class Money {
  private cents: number = 0

  constructor(initialCents: number | string) {
    if (typeof initialCents === 'number') {
        this.cents = Math.round(initialCents * 100) / 100
    } else {
      this.cents = this.string2number(initialCents)
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
    if (parts.length == 1) {
      return parseInt(parts[0])
    } else {
      const base: number = parseInt(parts[0])
      const frac: number = parseInt(parts[1])
      return base * 100 + frac
    }
  }
  getValue(): number {
    return this.cents / 100
  }
  getFormatted(n: number = 0): string {
    const s = this.cents.toString()
    const f = s.substring(0, s.length - 2)
    const c = s.substring(s.length - 2)
    return (f + '.' + c).padStart(n, "0")
  }
  round5(): Money {
    const rounded = Math.round(this.getValue() * 20) / 20
    return new Money(rounded)
  }
}
