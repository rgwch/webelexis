/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/

/**
 * Class for access to some elements specific to Elexis:
 *
 * VersionedResource is a binary format that holds several (practically unlimited) versions of a Text, each marked
 * with a version number and a user-supplied remark.
 *
 * ExtInfo is a compressed Java Hashtable to store fields not available in the database
 *
 * Both data types are highly java specific, and so instead of decrypting them "manually", we simply call
 * appropriate java methods via node-java.
 *
 */

import * as java from 'java'
import * as moment from 'moment'
import * as JSZip from 'jszip'

const utils = "rgw-toolbox-4.2.3.jar"
const zip = new JSZip()

export interface IVersionedResource {
  text: string,
  remark: string,
  timestamp: string,
  version: number
}
export class ElexisUtils {

  constructor() {
    let path = require('path');
    let fs = require('fs');
    java.classpath.push(path.join(__dirname, `../lib/${utils}`));
    if (!fs.existsSync(path.join(__dirname, `../lib/${utils}`))) {
      throw new Error(`../lib/${utils} not found!`)
    }

  }

  /**
   * create an empty versionedResource
   */
  public createVersionedResource():any {
    let vr = java.callStaticMethodSync("ch.rgw.tools.VersionedResource", "load", null)
    let bindata = java.callMethodSync(vr, "serialize")
    return bindata
  }

  /**
   * Get the head revision of a VersionedResource
   * @returns
   * */
  public getVersionedResource(bindata:any):IVersionedResource {
    if (bindata && bindata.length) {
      let array = java.newArray("byte",
        Array.prototype.slice.call(bindata, 0)
      )
      let vr = java.callStaticMethodSync("ch.rgw.tools.VersionedResource", "load", array)
      let entry = java.callMethodSync(vr, "getHead")
      let lastVersion = java.callMethodSync(vr, "getHeadVersion")
      let item = java.callMethodSync(vr, "getVersion", lastVersion)
      let label = java.callMethodSync(item, "getLabel")
      var sl = label.split(/\s*-\s*/)

      return {
        text: entry,
        remark: sl[1],
        timestamp: moment(sl[0], "DD.MM.YYYY, HH:mm:ss").format(),
        version: lastVersion
      }
    } else {
      return {
        text: "?",
        remark: "?",
        timestamp: moment().format(),
        version: 0
      }
    }
  }

  /**
   * Add a new entry to a VersionedResource
   * @param entry
   * @param newText
   * @param remark
   * @returns {*}
   */
  public updateVersionedResource(entry:any, newText:string, remark:string):any {
    let array = java.newArray("byte",
      Array.prototype.slice.call(entry, 0)
    )
    let vr = java.callStaticMethodSync("ch.rgw.tools.VersionedResource", "load", array)
    java.callMethodSync(vr, "update", newText, remark)
    let binfield = java.callMethodSync(vr, "serialize")
    return binfield
  }

  public getExtInfo(buffer:any):any {
    let array = java.newArray("byte",
      Array.prototype.slice.call(buffer, 0)
    )

    let extInfo = java.callStaticMethodSync("ch.rgw.tools.ExtInfo", "fold", array)
    if (extInfo) {
      return java.callStaticMethodSync("ch.rgw.tools.ExtInfo", "toJson", extInfo)
    }
    return {}
  }

  public async writeExtInfo(obj:any) {
    let str = JSON.stringify(obj)
    zip.file("json", str)
    return zip.generateAsync({"type": "nodebuffer"})

  }

  private dateStrings(date) {
    var month = (date.getMonth() + 1).toString();
    if (month.length < 2) {
      month = '0' + month
    }
    var day = date.getDate().toString();
    if (day.length < 2) {
      day = '0' + day
    }
    return {
      "year": date.getFullYear().toString(),
      "month": month,
      "day": day
    }
  }

  // create a YYYYMMDD String from a Date object
  public makeCompactFromDateObject(date) {
    var ret = this.dateStrings(date)
    return ret.year + ret.month + ret.day
  }

  // Create a Date object from a YYYYMMDD String
  public makeDateObjectFromCompact(datestring) {
    if (datestring !== undefined && datestring.length === 8) {
      let year:number = parseInt(datestring.substring(0, 4))
      let month:number = parseInt(datestring.substring(4, 6)) - 1
      let day:number = parseInt(datestring.substring(6, 8))
      return new Date(year, month, day)
    } else {
      return ""
    }
  }

  // Create a Date object from a dd.mm.yyyy String
  public makeDateObjectFromLocal(datestring) {
    if (datestring !== undefined) {
      var ar = datestring.split(".")
      var yr = parseInt(ar[2])
      if (yr < 30) {
        yr += 2000
      } else if (yr < 100) {
        yr += 1900
      }
      return new Date(yr, parseInt(ar[1]) - 1, ar[0])
    } else {
      return new Date()
    }
  }

  // make a hh:mm String from a number of minutes
  public makeTime(minutes:number):string {
    let hours:number = Math.floor(minutes / 60)
    let rest:number = minutes - (hours * 60)
    let mins:string = rest.toString()
    let hoursS:string = hours.toString()
    if (hoursS.length < 2) {
      hoursS = "0" + hours
    }
    if (mins.length < 2) {
      mins = "0" + mins
    }

    return hoursS + ":" + mins
  }

  // make a number of minutes from a hh:mm String
  public makeMinutes(timeString):number {
    var hm = timeString.split(":")
    var ret = parseInt(hm[0]) * 60 + parseInt(hm[1])
    return ret;
  }

  // make a YYYY-MM-DD String from a Date object
  public makeDateRFC3339(date) {
    var ret = this.dateStrings(date)
    return ret.year + "-" + ret.month + "-" + ret.day
  }

  // make a dd.mm.yyyy String from a Date object
  public makeLocalFromDateObject(date) {
    var ret = this.dateStrings(date)
    return ret.day + "." + ret.month + "." + ret.year
  }

  // make a dd.mm.yyyy from yyyymmdd
  public makeLocalFromCompact(ed) {
    if (ed === undefined || ed === null || ed.length != 8) {
      return ""
    } else {
      return ed.substring(6, 8) + "." + ed.substring(4, 6) + "." + ed.substring(0, 4)
    }

  }

  public makeCompactFromLocal(lc) {
    if (lc === undefined || lc === null) {
      return ""
    } else {
      return this.makeCompactFromDateObject(this.makeDateObjectFromLocal(lc))
    }
  }

  public elexisTimeStamp(date:Date){
    return (Math.round(date.getTime()/60000)).toString()
  }
}