/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {FhirBundle, FHIR_Resource, FHIR_Patient, FHIR_ResourceEntry} from "../models/fhir";
import {FHIRobject, FhirObjectFactory} from "../models/fhirobj";
import {BundleResult} from "./fhirservice";


export class Validator {


  static checkFHIRBundle(check: string | FhirBundle, factory: FhirObjectFactory): BundleResult {
    var ans: FhirBundle
    if (typeof check == "string") {
      try {
        ans = JSON.parse(check as string)
      } catch (error) {
        console.log(error)
        return <BundleResult>{"status": "error", "message": "invalid json", count: 0}
      }
    } else {
      ans = check as FhirBundle
    }
    if (ans["resourceType"] !== "Bundle") {
      return <BundleResult>{
        "status" : "error",
        "message": "Bad or missing resourceType " + JSON.stringify(ans),
        count    : 0
      }
    }
    if (ans["type"] !== "searchset") {
      return <BundleResult>{"status": "error", "message": "Bad response from server", count: 0}
    }
    return <BundleResult>{
      "status": "ok",
      values  : ans.entry.map(obj => factory.createObject(obj.resource)),
      count   : ans.total,
      links   : ans.link
    }
  }


  static getArray(fhir: any, name: string): Array<any> {
    if (fhir == undefined || name == undefined || fhir == null || name == null) {
      return []
    } else {
      var ret = fhir[name]
      return ret == null ? [] : ret
    }
  }

  static getSubobject(fhir: any, name: string) {
    if (fhir == undefined || name == undefined || fhir == null || name == null) {
      return {}
    } else {
      var ret = fhir[name]
      return ret == null ? {} : ret
    }
  }

  static getString(fhir: any, name: string): String {
    if (fhir == undefined || name == undefined || fhir == null || name == null) {
      return ""
    } else {
      var ret = fhir[name]
      return ret == null ? "" : ret
    }
  }

  static getNumber(fhir: any, name: string): Number {
    if (fhir == undefined || name == undefined || fhir == null || name == null) {
      return 0
    } else {
      var ret = fhir[name]
      return ret == null ? 0 : ret
    }
  }


}
