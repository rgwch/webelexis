import { LogManager } from 'aurelia-framework';
import { inlineView } from 'aurelia-framework';
import { KontaktManager } from './../models/kontakt-model';
import { PatientManager } from '../models/patient-model';
import { DateTime } from '../services/datetime';
import { I18N } from 'aurelia-i18n';
import { bindable, autoinject } from 'aurelia-framework';
import { IPatient } from './../models/patient-model';
import { FlexformConfig } from '../forms/flexform';
import * as moment from 'moment'

const log=LogManager.getLogger('Personal-Data')


@inlineView(`
<template>
  <require from="../forms/flexform"></require>
  <flex-form ff_cfg.bind="ffc" entity.bind="kontakt"></flexform>
</template>`)
@autoinject
export class PersonalData {
  @bindable kontakt: IPatient

  constructor(private i18: I18N, private dt:DateTime, private km:KontaktManager) { }

  kontaktChanged(newp,old){
    log.info("Change patient from "+(old ? old.bezeichnung1 : old)+" to "+(newp ? newp.bezeichnung1 : newp))
  }
  ffc: FlexformConfig = {
    title: () => this.km.getLabel(this.kontakt),
    compact: true,
    attributes: [
      {
        attribute: "bezeichnung1",
        label: this.i18.tr("contact.lastname"),
        datatype: "string",
        validation: this.char80,
        validationMessage: this.i18.tr("validation.onlyText"),
        sizehint: 4
      },
      {
        attribute: "bezeichnung2",
        label: this.i18.tr("contact.firstname"),
        datatype: "string",
        validation: this.char80,
        validationMessage: this.i18.tr("validation.onlyText"),
        sizehint: 4
      },
      {
        attribute: "geburtsdatum",
        label: this.i18.tr("contact.birthdate"),
        datatype: {
          toForm: x => this.dt.elexisDateToLocalDate(x),
          toData: x => this.dt.localDateToElexisDate(x)
        },
        validation: this.checkdate,
        validationMessage: this.i18.tr("validation.invalidDate"),
        sizehint: 2
      },
      {
        attribute: "geschlecht",
        label: this.i18.tr("contact.gender"),
        datatype: "string",
        sizehint: 2
      },
      {
        attribute: "strasse",
        label: this.i18.tr("address.street"),
        datatype: "string",
        sizehint: 12
      },
      {
        attribute: "plz",
        label: this.i18.tr("address.zip"),
        datatype: "string",
        sizehint: 3
      },
      {
        attribute: "ort",
        label: this.i18.tr("address.place"),
        datatype: "string",
        sizehint: 9
      } /*{
        attribute: "contactPoints",
        label: i18.tr("contact.contactpoints"),
        datatype: "string",
        sizehint: 12
      }, */,
      {
        attribute: "telefon1",
        label: this.i18.tr("contact.phone1"),
        datatype: "string",
        sizehint: 4
      },
      {
        attribute: "telefon2",
        label: this.i18.tr("contact.phone2"),
        datatype: "string",
        sizehint: 4
      },
      {
        attribute: "natelnr",
        label: this.i18.tr("contact.mobile"),
        datatype: "string",
        sizehint: 4
      },
      {
        attribute: "email",
        label: this.i18.tr("contact.email"),
        datatype: "string",
        sizehint: 6
      },
      {
        attribute: "bemerkung",
        label: this.i18.tr("contact.remark"),
        datatype: "text",
        sizehint: 12
      }
    ]
  };
/**
   * Check that a date is valid and not in the future
   * @param val 
   * @param obj 
   */
  checkdate(val, obj) {
    const m = moment(val);
    if (m.isValid()) {
      if (m.isBefore(new Date())) {
        return true;
      }
    }
    return false;
  }  

  /**
   * Verify that val is a string of 2 to 80 chars length, containing
   * only "normal" characters.
   * @param val 
   * @param obj 
   */
  char80(val, obj) {
    if (typeof val == "string") {
      if (/^[^;\.+"\*%=§<>|,]{2,80}$/i.test(val)) {
        return true;
      }
    }
    return false;
  }
}


