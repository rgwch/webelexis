/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2023 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { getService } from "../services/io";
import type { ElexisType } from "./elexistype";
import { ObjectManager } from "./object-manager";
import type { ArticleType } from "./prescription-model";

export interface StockEntryType extends ElexisType {
  min: number
  max: number
  current: number
  fractionUnits: number
  article_id: string
  _Article?: ArticleType
  _Title?: string
}

export class StockManager extends ObjectManager {
  private articleLoader;
  constructor() {
    super('stock');
    this.articleLoader = getService("article")
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
        article_id: article.id,
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
  async getLabel(item: StockEntryType): Promise<string> {
    const article = await this.getArticle(item);
    if (article) {
      return item.min + "/" + item.current + "/" + item.max + ": " + article.dscr
    } else {
      return "not found"
    }
  }
  async getTitle(item: StockEntryType): Promise<string> {
    if (!item._Title) {
      const art = await this.getArticle(item)
      if (art) {
        item._Title = art.dscr
      } else {
        item._Title = "unbekannter Artikel"
      }
    }
    return item._Title;
  }
  async getArticle(item: StockEntryType): Promise<ArticleType> {
    if (!item._Article) {
      try {
        item._Article = this.articleLoader.get(item.article_id)
      } catch (err) {
        console.log(err)
        return null;
      }
    }
    return item._Article
  }

}
