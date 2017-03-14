/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */

import {Refiner} from "../models/fhirsync";
import {NoSQL} from "./mongo";
import {FhirBundle,FHIR_Resource,FHIR_ResourceEntry} from "../common/models/fhir";
import * as moment from "moment";
import * as sha1 from 'sha1'
import {FhirObject} from "../models/fhirobject";
import {QueryBatch, QueryCache} from "./query_cache";

const batchSize = 50
/**
 * Janus can fetch FHIR objects from an SQL database as well as from a Mongo database. Both databases
 * are synchronized, so that new and newly updated objects are mirrored. In the progress of transition,
 * synchronization can be set to one of several modes: bidirectional, sql to mongo only, on request only.
 */
export class Janus {
  private queryCache: QueryCache

  constructor() {
    this.queryCache = new QueryCache(300)
  }

  /**
   * Get a single object, identified by its id
   * @param id unique id of the requested object
   * @param refiner - a query Refiner for the specific type of object
   * @returns a Promise with the requested object or undefined, if no such object exists
   */
  public async getAsync(id: string, refiner: Refiner): Promise<any> {
    let mnosql = await refiner.fetchNoSQL({id: id})
    let msql = await refiner.fetchSQL({id: id})
    return Promise.all([mnosql, msql]).then((values) => {
      let sqlObj
      if (values[1].length > 0) {
        sqlObj = values[1][0]
      }
      let noSqlObj:FHIR_Resource
      if(values[0].length>0) {
        noSqlObj = values[0][0]
      }
      if (noSqlObj) {
        if (sqlObj) {
          return this._checkItems(noSqlObj, sqlObj, refiner)
        } else {
          refiner.pushSQL(noSqlObj)
          return noSqlObj
        }
      } else {
        refiner.pushNoSql(sqlObj)
        return sqlObj
      }
    })
  }

  // test http://localhost:3000/fhir/batch/2d7af0fbf6670386ff8726894b0a8d09df7a8611/50/50
  /**
   * fetch a batch of results for a previously executed queryAsync
   * @param id the query id, as returned by queryAsync
   * @param begin first result to return
   * @param count number of results to return
   * @returns {Promise<FhirBundle>}
   */
  public async getBatch(id: string, begin: number, count: number) {
    let batch=await this.queryCache.fetch(id,begin,count)
    return this._makeBatchedBundle(batch)
  }

  private _toSql(fhir: FHIR_Resource, refiner: Refiner) {

  }

// test: http://localhost:3000/fhir/Encounter?patient=f89c497e300dd3028550
  /**
   * query the databases with parameters as defined in fhir (e.g. 'server/Patient?name=foo&address=there')
   * Objects are queried in sql and nosql databses and synchronized on retrieve. If the result has more
   * elements as defined in batchSize, only the first /batchSize/ elements are returned. The cleient can request
   * more batches with the "link.next" parameter in the result set.
   *
   * @param params parameters for the query
   * @param refiner
   * @param queryExpression the original query Expression
   * @returns a Promise for a FHIR Bundle. 'total' contains the full count of all results. 'entry' contains at most
   * 'batchSize' elements. 'link' contains a 'next' element, if not all results are returned.
   */
  public queryAsync(params: {}, refiner: Refiner, queryExpression: string): Promise<FhirBundle> {
    let _self = this
    let sha=sha1(queryExpression) as string
    let batched = this.queryCache.fetch(sha, 0, batchSize)
    if (batched.status == "ok") {
      return new Promise((resolve, reject) => {
        resolve(this._makeBatchedBundle(batched))
      })
    } else {
      let msql = refiner.fetchSQL(params)
      let mnosql = refiner.fetchNoSQL(params)

      return Promise.all([msql, mnosql]).catch(err=>{
        console.log(err)
      }).then((values) => {
        var resulting = []
        var checked = {}
        values[0].forEach(function (entry: FHIR_Resource) {
          let id = entry.id;
          let mongoElem = values[1].find(function (elem: FHIR_Resource) {
            return elem.id === id
          })
          if (mongoElem) {
            resulting.push(_self._checkItems(mongoElem, entry, refiner))
            checked[mongoElem.id] = true
          } else {
            refiner.pushNoSql(entry).catch(err => {
              console.log("error pushing to nosql " + err)
              throw("internal error")
            })
            resulting.push(entry)
          }
        })
        values[1].forEach(function (entry: FHIR_Resource) {
          if (checked[entry.id] == undefined) {
            let sqlElem = values[0].find(function (elem: FHIR_Resource) {
              let id = entry.id
              return elem.id === id
            })
            if (!sqlElem) {
              refiner.pushSQL(entry)
              resulting.push(entry)
            }
          }
        })
        var ordered = resulting.sort(refiner.compare)
        if (ordered.length > batchSize) {
          this.queryCache.store(sha, ordered)
          return this._makeBatchedBundle(this.queryCache.fetch(sha, 0, batchSize))
        } else {
          return this._makeBundle(
            ordered.map(elem => {
              return {
                fullUrl : `/${refiner.dataType}/${elem.id}`,
                resource: elem
              }
            }), queryExpression)
        }
      })
    }
  }

  public putAsync(fhir:FHIR_Resource, refiner:Refiner){
    return Promise.all([refiner.pushNoSql(fhir),refiner.pushSQL(fhir)]).then(result=>{
      return fhir
    })
  }

  /**
   * compare two FHIR_Resources and return the newer one.
   * If both have standard time stamps, the time stamps are compared. If one has
   * a time stamp, the one without time stamp is considered older. If both have no time stamps, they are considered
   * equal
   * @param itemA the first FHIR_Resource
   * @param itemB the second FHIR-Resource
   * @returns the newer FHIR_Resource. If both are equal, itemA is returned
   */
  private _checkItems(itemA: FHIR_Resource, itemB: FHIR_Resource, refiner: Refiner): FHIR_Resource {
    let t1 = FhirObject.getAttribute(itemA, "meta.lastUpdated")
    let t2 = FhirObject.getAttribute(itemB, "meta.lastUpdated")
    if (t1.startsWith("Invalid")) {
      t1 = undefined
    }
    if (t2.startsWith("Invalid")) {
      t2 = undefined
    }
    if (t1) {
      if (t2) {
        let m1 = moment(t1)
        let m2 = moment(t2)
        if (m1.isBefore(m2)) {
          refiner.pushNoSql(itemB)
          return itemB
        } else if (m1.isAfter(m2)) {
          refiner.pushSQL(itemA)
          return itemA
        } else {
          return itemA // equal
        }
      } else {
        refiner.pushSQL(itemA)
        return itemA
      }
    }
    else if (t2) {
      refiner.pushNoSql(itemB)
      return itemB
    }
    return itemA // equal
  }

  private _makeBatchedBundle(batch: QueryBatch): FhirBundle {
    let prefix = "/batch/" + batch.id
    let dataType="generic";
    let cnt=batch.contents;
    if(cnt){
      let sample=cnt[0]
      dataType=sample["resourceType"]
    }
    let bundle = this._makeBundle(cnt.map(elem=>{
      return {
        fullUrl : `/${dataType}/${elem.id}`,
        resource: elem
      }
    }), `${prefix}/${batch.offset}/${batch.contents.length}`)
    let link = bundle.link

    link.push({
      relation: "first",
      url     : `${prefix}/0/${batchSize}`
    })
    let prevOffset = batch.offset - batchSize
    if(prevOffset>0) {
      link.push({
        relation: "prev",
        url     : `/${prefix}/${prevOffset}/${batchSize}`
      })
    }
    let nextOffset = batch.offset + batchSize
    if(nextOffset<batch.totalSize) {
      link.push({
        relation: "next",
        url     : `${prefix}/${nextOffset}/${batchSize}`
      })
    }
    let lastOffset = batch.totalSize - batchSize
    if (lastOffset < 0) {
      lastOffset = 0
    }
    link.push({
      relation: "last",
      url     : `${prefix}/${lastOffset}/${batchSize}`
    })
    bundle.link = link
    bundle.total = batch.totalSize
    return bundle
  }

  private _makeBundle(arr: Array<FHIR_ResourceEntry>, url: string): FhirBundle {
    let link=[]
    var fhir = {
      resourceType: "Bundle",
      id          : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }),
      meta        : {
        "lastUpdated": moment().format()
      },
      type        : "searchset",
      total       : arr.length,
      link        : [{
        relation: "self",
        url     : url
      }],
      entry       : arr
    }
    return fhir
  }

}

