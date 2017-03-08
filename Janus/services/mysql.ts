/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/

declare function createPool(any)
import * as mysql from 'mysql'
import * as nconf from 'nconf'

export interface SQL{
  queryAsync(query,values):Promise<any>
  insertAsync(sql,values):Promise<void>
}
export class MySql implements SQL{
  private _pool;
  private dbconf;

  constructor() {
    this.dbconf = nconf.get('mysqldb')
    this._pool = mysql.createPool(this.dbconf)

  }

  public async getAsync(query, values):Promise<any> {
    let result = await this._pool.query(query, values)
    if (result.length > 0) {
      return result[0]
    } else {
      return undefined
    }
  }
  public queryAsync(query, values):Promise<any> {
    return new Promise<any>((resolve, reject)=> {
      this._pool.query(query, values, function (err, result) {
        if (err) {
          console.log(err.code)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  public insertAsync(sql, values):Promise<void> {
    return new Promise<any>((resolve, reject)=> {
      /*
      this._pool.query(sql, values, function (err, result, fields) {
        if (err) {
          console.log(err.code)
          reject(err)
        } else {
          resolve()
        }
      })
      */
      resolve()
    })
  }

  public close() {
    this._pool.end()
  }
}