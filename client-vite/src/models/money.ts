5
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

/**
 * Unmodifiable repressentation of an amount. Modifying methods retrn a new instance.
 */
export class Money {
  private cents: number = 0

  /**
   * create a new Money
   * @param initialCents either a double in cents or a string with . or ,
   */
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
  /**
   * return the amount as Francs/Euro
   * @returns
   */
  public getValue(): number {
    return this.cents / 100
  }
  /**
   * Return the amount as formatted string
   * @param n fill n digits with leading zeroes. Defaults to 0
   * @returns
   */
  public getFormatted(n: number = 0): string {
    const s = this.cents.toString()
    const f = s.substring(0, s.length - 2) || '0'
    const c = s.substring(s.length - 2).padStart(2, '0')
    return (f + '.' + c).padStart(n, '0')
  }
  /**
   * Round the amount to the nearest 5cent
   * @returns
   */
  round5(): Money {
    const rounded = Math.round(this.getValue() * 20) / 20
    return new Money(rounded * 100)
  }

  addCents(n: number): Money {
    return new Money(this.cents + n)
  }
  subtractCents(n: number): Money {
    return new Money(this.cents - n)
  }
  getCentsAsString() {
    return this.cents.toString()
  }
  subtract(m: Money): Money {
    return new Money(this.cents - m.cents)
  }
  add(m: Money): Money {
    return new Money(this.cents + m.cents)
  }
  isNeglectable(): boolean {
    return (Math.abs(this.cents) < 3)
  }
  isNegative(): boolean {
    return (this.cents < 0)
  }
  isEqual(other: Money): boolean {
    return (Math.abs(this.cents - other.cents) < 3)
  }
  compareTo(other: Money) {
    return this.cents - other.cents
  }
}
