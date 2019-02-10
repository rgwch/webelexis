/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject, Container } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import * as moment from "moment";
import { FlexformConfig, FlexformListRenderer } from "../components/flexform";
import { DateTime } from "../services/datetime";
import { KontaktType } from "./kontakt";
import { StickerManager } from "./stickers.model";

/**
 * An Elexis "Patient"
 */
export interface PatientType extends KontaktType {}

@autoinject
export class PatientManager {
  constructor(private dt: DateTime) {}

  /**
   * create a standardized human readable 'concerning' line from patient data
   * (usage e.g. in directory names for documents concerning a patient - better
   * readable than an id). gives something like maier_hans_22.04.1980 or
   * x_unknown_x
   * @param pat {PatientType}
   */
  public createConcern(pat: PatientType) {
    const n1 = pat.bezeichnung1;
    const n2 = pat.bezeichnung2;
    const n3 = pat.geburtsdatum;
    let ret = n1 ? n1.substr(0, Math.min(3, n1.length)) : "x";
    ret += "/";
    ret += n1 || "x";
    ret += "_";
    ret += n2 || "x";
    ret += "_";
    ret += n3 ? this.dt.ElexisDateToLocalDate(n3) : "x";
    return ret;
  }
}

export class Patient {
  public static dt = Container.instance.get(DateTime);
  public static i18 = Container.instance.get(I18N);
  public static sm: StickerManager = Container.instance.get(StickerManager);

  public static getLabel(obj: any): string {
    let ret = obj.Bezeichnung1 + " " + obj.Bezeichnung2;
    if (obj.geschlecht) {
      ret += ` (${obj.geschlecht})`;
    }
    if (obj.geburtsdatum) {
      const bd = moment(obj.geburtsdatum, "YYYYMMDD");
      const now = moment();
      const years = now.diff(bd, "years");
      ret += `, ${Patient.dt.ElexisDateToLocalDate(obj.geburtsdatum)}`;
      ret += ` (${years})`;
    }
    if (obj.patientnr) {
      ret += " [" + obj.patientnr + "]";
    }
    const sticker = Patient.sm.getFirstSticker(obj.stickers);
    let style = "color:black;";
    if (sticker) {
      style = `color:#${sticker.foreground ||
        "black"};background-color:#${sticker.background || "white"};`;
    }
    let final = `<span style="${style}">${ret}</span>`;
    let images = "";

    if (obj.stickers) {
      for (const name of obj.stickers) {
        const imgdata = Patient.sm.getImage(name);
        if (imgdata) {
          images += `<img src="data:image/png;base64,${imgdata}" alt="${name}" style="height:1em;width:1em;padding-left:2px;"
         data-toggle="tooltip" title="${name}">`;
        }
      }
    }
    if (images) {
      final += images;
    }

    return final;
  }

  /**
   * create a field definition for detail display in FlexForm or in a new item dialog.
   */
  public static getDefinition(): FlexformConfig {
    const i18 = Patient.i18;
    return {
      title: () => "", // ()=>Patient.getTitle(),
      compact: true,
      attributes: [
        {
          attribute: "bezeichnung1",
          label: i18.tr("contact.lastname"),
          datatype: "string",
          validation: Patient.char80,
          validationMessage: Patient.i18.tr("validation.onlyText"),
          sizehint: 4
        },
        {
          attribute: "bezeichnung2",
          label: i18.tr("contact.firstname"),
          datatype: "string",
          validation: Patient.char80,
          validationMessage: Patient.i18.tr("validation.onlyText"),
          sizehint: 4
        },
        {
          attribute: "geburtsdatum",
          label: i18.tr("contact.birthdate"),
          datatype: {
            toForm: x => Patient.dateModelToView(x),
            toData: x => Patient.viewToDateModel(x)
          },
          validation: Patient.checkdate,
          validationMessage: Patient.i18.tr("validation.invalidDate"),
          sizehint: 2
        },
        {
          attribute: "geschlecht",
          label: i18.tr("contact.gender"),
          datatype: "string",
          sizehint: 2
        },
        {
          attribute: "strasse",
          label: i18.tr("address.street"),
          datatype: "string",
          sizehint: 12
        },
        {
          attribute: "plz",
          label: i18.tr("address.zip"),
          datatype: "string",
          sizehint: 3
        },
        {
          attribute: "ort",
          label: i18.tr("address.place"),
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
          label: i18.tr("contact.phone1"),
          datatype: "string",
          sizehint: 4
        },
        {
          attribute: "telefon2",
          label: i18.tr("contact.phone2"),
          datatype: "string",
          sizehint: 4
        },
        {
          attribute: "natelnr",
          label: i18.tr("contact.mobile"),
          datatype: "string",
          sizehint: 4
        },
        {
          attribute: "email",
          label: i18.tr("contact.email"),
          datatype: "string",
          sizehint: 6
        },
        {
          attribute: "bemerkung",
          label: i18.tr("contact.remark"),
          datatype: "text",
          sizehint: 12
        }
      ]
    };
  }

  public static loadContactOptions(obj: PatientType) {}

  /**
   * Verify that val is a string of 2 to 80 chars length, containing
   * only "normal" characters.
   * @param val 
   * @param obj 
   */
  public static char80(val, obj) {
    if (typeof val == "string") {
      if (/^[^;\.+"\*%=§<>|,]{2,80}$/i.test(val)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check that a date is valid and not in the future
   * @param val 
   * @param obj 
   */
  public static checkdate(val, obj) {
    const m = moment(val);
    if (m.isValid()) {
      if (m.isBefore(new Date())) {
        return true;
      }
    }
    return false;
  }
  /**
   * convert a database-style date to a local-style date
   * @param val 
   */
  public static dateModelToView(val) {
    const m = moment(val, "YYYYMMDD");
    const format = Patient.i18.tr("adapters.date_format");
    const ret = m.format(format);
    return ret;
  }

  /**
   * convert a local-style date to a database-style date
   * @param val 
   */
  public static viewToDateModel(val) {
    const m = moment(val, "D.M.YYYY");
    const ret = m.format("YYYYMMDD");
    return ret;
  }
}
