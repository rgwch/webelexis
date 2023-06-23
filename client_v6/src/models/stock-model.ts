/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2023 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import type { ElexisType } from "./elexistype";
import { ObjectManager } from "./object-manager";
import type { ArticleType } from "./prescription-model";

export interface StockEntryType extends ElexisType {
  min: number
  max: number
  current: number
  fractionUnits: number
  articleID: string
  _Article?: ArticleType
}

export class StockManager extends ObjectManager {
  constructor() {
    super('stock_entry');
  }

  /**
   * Put an item to the store
   * @param item 
   * @param num 
   * @returns 
   */
  async put(item: StockEntryType, num: number): Promise<number> {
    item.current = item.current + num;
    await this.save(item);
    return item.current;
  }

  /**
   * Remove an item fromthe store
   * @param item 
   * @param num 
   * @returns 
   */
  async take(item: StockEntryType, num: number): Promise<number> {
    item.current = item.current - num;
    await this.save(item);
    return item.current;
  }
  /**
   * Insert an Article to the store. If a StockEntry exists, increase its number,
   * else create a StockEntry an set that to 1,
   * @param article 
   * @returns 
   */
  async addArticle(article: ArticleType): Promise<StockEntryType> {
    const item = await this.getItem(article);
    item.current = item.current + 1;
    return item
  }

  /**
   * get a StockEntry from an Article. If no such Stockentry exists,
   * it will be created and returned
   * @param article 
   * @returns 
   */
  async getItem(article: ArticleType): Promise<StockEntryType> {
    const items = await this.find({ query: { article_id: article.id } });
    if (items.total > 0) {
      return items.data[0]
    } else {
      const ret: StockEntryType = {
        articleID: article.id,
        current: 0,
        max: 1,
        min: 1,
        fractionUnits: 1,
        _Article: article
      }
      await this.save(ret);
      return ret;
    }

  }

}