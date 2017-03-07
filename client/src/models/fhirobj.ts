/**********************************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************************/

import {FHIR_Resource} from "./fhir";
import {computedFrom} from "aurelia-framework";
import {I18N} from 'aurelia-i18n'
import * as moment from 'moment'
import {FhirResourceValueConverter} from '../resources/fhir-resource-value-converter'
import {Container} from "aurelia-framework";
import {FHIR_Narrative} from "./fhir";

export interface FhirObjectFactory {
  entities:Array<string>
  subtype:string
  createObject(fhir:FHIR_Resource):FHIRobject

}

/**
 * Base class to manipulate FHIR (http://hl7.org/fhir) resources.
 */
export class FHIRobject {
  public fhir:FHIR_Resource
  public stored:number = 0
  private static converter = Container.instance.get(FhirResourceValueConverter)
  protected static i18 = Container.instance.get(I18N)

  constructor(data:FHIR_Resource, expectedType:string) {
    if (data.resourceType !== expectedType) {
      throw "Bad resource type"
    }

    this.fhir = data

  }

  @computedFrom('fhir')
  get id() {
    return this.fhir.id
  }

  /**
   * Convert a FHIR date  to a local date string
   * @param date FHIR conformant date string (union of xs:date, xs:gYearMonth, xs:gYear)
   * @returns {string} a date string for the current locale. e.g. "22.3.2016"
   */
  public static dateToLocal(date:string) {
    return date ? moment(date).format(FHIRobject.i18.tr('adapters.date_format')) : "?"
  }

  /**
   * Convert a local date string to a FHIR conformant date string
   * @param localdate a date, such as 22.3.2016
   * @returns {string} the FHIR-conformant representation
   */
  public static dateToStandard(localdate:string) {
    return localdate ? moment(localdate).format() : moment(new Date()).format()
  }

  /**
   * Convert a FHIR conformant dateTime to a local Time/date String
   * @param datetime a FHIR conformant dateTime (union of xs:dateTime, xs:date, xs:gYearMonth, xs:gYear)
   * @returns {string} a datetime string for tge current locale (e,g, "22.3.2016, 10:15"
   */
  public static dateTimeToLocal(datetime:string) {
    return datetime ? moment(datetime).format(FHIRobject.i18.tr('adapters.datetime_format')) : "?"
  }

  /**
   * Convert a local date/time to a FHIR-conformant dateTime string
   * @param localdatetime a local date/time
   * @returns {string} a FHIR dateTime
   */
  public static dateTimeToStandard(localdatetime:string) {
    return localdatetime ? moment(localdatetime).format() : moment(new Date()).format()
  }

  /**
   * Fetch the contents of a property, interpret it as a date and return its localized form.
   * @param fieldname path/name of a field that contains a date in FHIR format e.g. some.where.date
   * @returns {string} the contents of the field as a localized date string
   */
  public getDateField(fieldname:string) {
    return FHIRobject.dateToLocal(this.getField(fieldname))
  }

  /**
   * Set a date property from a local date string
   * @param fieldname, e.g. some.where.date
   * @param value a local date string, such as "22.3.2016"
   */
  public setDateField(fieldname:string, value:string) {
    this.setField(fieldname, FHIRobject.dateToStandard(value))
  }

  public getTimeField(fieldname:string) {
    let tm = FHIRobject.converter.toView("", fieldname, this.fhir)
    if (tm) {
      return moment(tm).format("HH:mm")
    } else {
      return "??:??"
    }

  }

  /**
   * * Fetch the contents of a property, interpret it as a dateTime and return its localized form.
   * @param fieldname path/name of a field that contains a date in FHIR format e.g. some.where.datetime
   * @returns {string} the contents of the field as a localized date/time string
   */
  public getDateTimeField(fieldname:string) {
    return FHIRobject.dateTimeToLocal(this.getField(fieldname))
  }

  /**
   * Set a dateTime property from a local date/time string
   * @param fieldname, e.g. some.where.date
   * @param value a local date string, such as "22.3.2016, 10:15"
   */
  public setDateTimeField(fieldname:string, value:string) {
    this.setField(fieldname, FHIRobject.dateTimeToStandard(value))
  }

  /**
   * Fetch a Field content from the FHIR resource
   * @param field path and name of the field, e.g. some.subentry[2].to.look
   * @returns {*|string}
   */
  public getField(field:string):string {
    return FHIRobject.converter.toView("", field, this.fhir)
  }

  /**
   * Set a field
   * @param field field path and name e,g, some.subentry[2].to.look
   * @param value the value to set
   */
  public setField(field:string, value:string) {
    FHIRobject.converter.fromView(value, field, this.fhir)
  }

  /**
   * Add a narrative. Almost every FHIR_Resource can contain a narrative (human readable form of the contents)
   * @param text The contents of the narrative. Can be plain text or simle HTML
   */
  public addNarrative(text:string) {
    let narrative:FHIR_Narrative = <FHIR_Narrative>{
      status: "additional",
      div: text
    }
    this.fhir.text = narrative
  }
}
