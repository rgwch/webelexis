import type { ElexisType } from "./elexistype";
import { ObjectManager } from "./object-manager";
import { DateTime } from 'luxon'
import { Money } from "./money"
import type Cash from "src/components/Cash.svelte";

export interface CashType extends ElexisType {
  nr: string
  date: string
  amount: string
  total: string
  category: string
  entry: string
}

export class CashManager extends ObjectManager {
  constructor() {
    super("kassenbuch")
  }

  public async fetchForYear(date: Date): Promise<Array<CashType>> {
    const from = DateTime.fromJSDate(date).set({ month: 1, day: 1 }).toFormat("yyyyLLdd")
    const until = DateTime.fromJSDate(date).set({ month: 12, day: 31 }).toFormat("yyyyLLdd")
    const query = {
      $and: [{ date: { $gte: from } }, { date: { $lte: until } }],
      $sort: { nr: -1 }
    }
    const ret = (await super.fetchAll(query)) as Array<CashType>
    return ret
  }
  public amount(e: CashType): string {
    return new Money(e.amount).getFormatted(2)
  }
  public total(e: CashType): string {
    return new Money(e.total).getFormatted(2)
  }
  public date(e: CashType): string {
    return DateTime.fromFormat(e.date, "yyyyLLdd").toLocaleString()
  }
  public setDate(date: Date | string, e: CashType): void {
    if (typeof date === "string") date = DateTime.fromISO(date).toJSDate()
    e.date = DateTime.fromJSDate(date).toFormat("yyyyLLdd")
  }
}

