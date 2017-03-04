/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import {DummyRefiner} from './dummy_refiner'
import {Janus} from '../services/janus'
import {DummyDB }from './dummy_nosql'
import {expect} from 'chai'
import {NoSQL} from "../services/mongo";
import {Refiner} from "../models/fhirsync";
import {DummySql} from "./dummy_sql";


@suite("Janus")
class JanusTest {
  private newer = {
    "resourceType": "DummyObject",
    "id": "1",
    "name": "newer",
    "meta": {
      "lastUpdated": "2017-01-25T10:00:01Z"
    }
  }
  private older = {
    "resourceType": "DummyObject",
    "id": "2",
    "name": "older",
    "meta": {
      "lastUpdated": "2017-01-24T11:00:01Z"
    }
  }

  private nosqlArray = [
    this.newer,
    this.older,
    {
      "resourceType": "DummyObject",
      "id": "3",
      "name": "number three",
      "meta": {
        "lastUpdated": "2017-01-24T11:10:01Z"
      }
    }
  ]

  private sqlArray = [
    this.older,
    {
      "resourceType": "DummyObject",
      "id": "4",
      "name": "number four",
      "meta": {
        "lastUpdated": "2016-01-24T11:10:01Z"
      }
    },
    this.newer
  ]

  @test("check nosql module")
  test_nosql(done:Function) {
    let mongo = new DummyDB({"resourceType": "UnitTest", "id": "007008009"}, [])
    mongo.getAsync("UnitTest", "1").then(function (result) {
      done()
    }, function (err) {
      console.log(err)
    })
  }

  @test("should get newer object from sql")
  test_get_newer(done:Function) {
    this._get(this.older, this.newer, function (value) {
      expect(value.name).to.equal('newer')
      done()

    })
  }

  @test("should get newer object from nosql")
  test_get_newer2(done:Function) {
    this._get(this.newer, this.older, function (value) {
      expect(value.name).to.equal('newer')
      done()
    })
  }

  @test("should get object from nosql if both same age (nosql/sql)")
  test_priorize_nosql(done:Function) {
    var cloned = Object.assign({}, this.newer)
    cloned.name = "cloned"
    this._get(cloned, this.newer, function (value) {
      expect(value.name).to.equal('cloned')
      done()
    })
  }

  @test("should get object from nosql if both same age (sql/nosql)")
  test_prioritize_nosql2(done:Function) {
    var cloned = Object.assign({}, this.newer)
    cloned.name = "cloned"
    this._get(this.newer, cloned, function (value) {
      expect(value.name).to.equal('newer')
      done()
    })
  }

  @test("should prioritize objects with time stamp (nosql/sql")
  test_timestamp(done:Function) {
    var cloned = Object.assign({}, this.newer)
    delete cloned.meta.lastUpdated
    cloned.name = "no timestamp"
    this._get(cloned, this.older, function (value) {
      expect(value.name).to.equal('older')
      done()
    })
  }

  @test("should prioritize objects with time stamp (sql/nosql")
  test_timestamp2(done:Function) {
    var cloned = Object.assign({}, this.newer)
    delete cloned.meta.lastUpdated
    cloned.name = "no timestamp"
    this._get(this.older, cloned, function (value) {
      expect(value.name).to.equal('older')
      done()
    })
  }

  @test("should synchronize both databases on queries")
  test_sync_query(done:Function) {
    let _self = this
    let mongo = new DummyDB(undefined, this.nosqlArray)
    let refiner = new DummyRefiner(undefined, this.sqlArray, this.nosqlArray)
    _self._checkEqual(mongo, refiner).then(success=> {
      let nosql = mongo.getData()
      nosql[0].meta.lastUpdated = "2017-02-20T08:00:10Z"
      let mongo2 = new DummyDB(undefined, nosql)
      _self._checkEqual(mongo2, refiner).then(function (okay) {
        done()
      }, function (fail) {
        console.log(nosql)
      })
    })
  }

  @test("should synchronize both databases on insert")
  test_insert_object(done:Function) {
    let mongo=new DummyDB(undefined,this.nosqlArray)
    let refiner = new DummyRefiner(undefined, this.sqlArray, this.nosqlArray)
    let cloned=Object.assign({},this.newer)
    cloned.id="7"
    cloned.meta.lastUpdated="2017-02-12T15:34:19Z"
    mongo.putAsync(cloned).then(success=>{
      this._checkEqual(mongo,refiner).then(equality=>{
        done()
      })
    })

  }

  private _get(obj_for_nosql, obj_for_sql, callback:Function) {
    let mongo = new DummyDB(obj_for_nosql, [])
    let refiner = new DummyRefiner(obj_for_sql, [], obj_for_nosql)
    let janus = new Janus(mongo)
    janus.getAsync("1", refiner).then(function (result) {
        callback(result)
      }, function (error) {
        console.log("failed: " + error)
      }
    ).catch(function (err) {
      console.log(err)
    })
  }

  private _query(mongo:NoSQL, refiner:Refiner, callback:Function) {
    let janus = new Janus(mongo)
    janus.queryAsync({}, refiner,"testquery").then(function (result) {
      callback(result)
    }).catch(error => {
      console.log(error)
    })
  }

  private  _checkEqual(nosql:DummyDB, sql:DummyRefiner):Promise<void> {
    return new Promise<void>((resolve, reject)=> {
      this._query(nosql, sql, result => {
        let nosqlData = nosql.getData().sort(function (a, b) {
          return parseInt(a.id) - parseInt(b.id)
        })
        let sqlData = sql.getData().sort(function (a, b) {
          return parseInt(a.id) - parseInt(b.id)
        })
        expect(sqlData).to.deep.equal(nosqlData)
        resolve()
      })
    })
  }
}
