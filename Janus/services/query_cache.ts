/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/

import {NoSQL} from "./mongo";

/**
 * Retrieve Items of a query in batches
 */
export interface QueryBatch {
  status: "ok" | "notfound" | "ended",
  contents?: Array<any>,
  offset?: number,
  batchSize?: number,
  totalSize?:number,
  id:string
}
export class QueryCache {
  private cache={}

  /**
   * create a new QueryCache
   * @param maxAge max age of queries in seconds
   */
  constructor(private maxAge:number) {
  }

  /**
   * Fetch a batch of a previously executed and stored query.
   * @param id id of the query
   * @param offset index of first result to retrieve
   * @param numItems number of items to fetch
   * @returns a QueryBatch
   */
  public fetch(id: string, offset: number, numItems:number): QueryBatch {
    let now = new Date().getTime() / 1000
    let found = this.cache[id]
    if (found) {
      let stored = found.timestamp
      let age = now - stored
      if (age < this.maxAge) {
        let size = found.values.length
        let last = Math.min(size, offset + numItems)
        if (last > offset) {
          return <QueryBatch>{
            status  : "ok",
            contents: found.values.slice(offset, last),
            offset: offset,
            batchSize: last-offset,
            totalSize: size,
            id: id
          }
        } else {
          delete this.cache[id]
          return <QueryBatch>{
            status: "ended",
            id:id
          }
        }
      } else {
        delete this.cache[id]
      }
    }
    return <QueryBatch>{
      status: "notfound",
      id:id
    }

  }

  public store(id: string, data: Array<any>) {
    this.cache[id] = {
      timestamp: new Date().getTime() / 1000,
      values   : data
    }
  }

  public purge(){
    let now=new Date().getTime()
    var expired=[]
    for(let key in this.cache){
      let entry=this.cache['key']
      if(now-entry.timestamp>this.maxAge){
        expired.push(key)
      }
    }
    expired.forEach(elem=>{
      delete this.cache[elem]
    })
  }
}