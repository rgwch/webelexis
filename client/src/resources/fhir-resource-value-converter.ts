/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {FHIR_Resource} from "../models/fhir";

export class FhirResourceValueConverter {

  /**
   * read a property or sub-property like foo.bar.baz from a FHIR_Resource.
   * if one or more of fhir[foo], fhir[foo[bar]] or fhir[foo[bar[baz]]] evaluates
   * to null or undefined, return an empty string.
   * @param fhir
   * @param property
   */
  public toView(value, property: string = "", fhir: FHIR_Resource) {
    var spl = property.split(/\./)
    var ret = ""
    var obj = fhir
    spl.forEach(subprop => {
      if (obj) {
        var prop = this.dive(obj, subprop)
        if (typeof(prop) == 'undefined' || prop == null) {
          obj = null
          ret = ""
        } else {
          ret = prop
          obj = prop
        }
      }
    })
    return ret
  }

  /**
   *  convert a value from the UI to a property of a FHIR_Resource.
   *  @param value The value to set (only alphanumeric characters and the dash are allowed)
   *
   */
  public fromView(value, property: string = "", fhir: FHIR_Resource) {
    if (fhir) {
      if (property.length > 1) {
        if (value.match(/[\w0-9\s\-]*/)) {
          eval("fhir." + property + "=value")
        }
      }
    }
    return value
  }

  private dive(obj, prop) {
    var i = prop.indexOf('[')
    if (i != -1) {
      var index = prop.substring(i + 1, prop.length - 1)
      prop = prop.substring(0, i)
      if (obj[prop] instanceof Array) {
        return obj[prop][index]
      } else {
        return undefined
      }
    } else {
      return obj[prop]
    }
  }
}
