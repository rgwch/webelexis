/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

//import { FlexformConfig, FlexformListRenderer } from "../components/flexform";
import type { KontaktType } from './kontakt-model'
import { StickerManager, type StickerType } from './stickers-model'
import { DateTime } from 'luxon'
import { _ } from 'svelte-i18n'
import { ObjectManager } from './object-manager'
import type { FlexformConfig } from '../widgets/flexformtypes'
import defs from '../services/util'
const sm: StickerManager = new StickerManager()


/**
 * An Elexis "Patient"
 */
export interface PatientType extends KontaktType {
  patientnr?: string
}

let trl
const unregister = _.subscribe((res) => (trl = res))

export class PatientManager extends ObjectManager {

  constructor() {
    super("patient")
  }

  /**
   * create a standardized human readable 'concerning' line from patient data
   * (usage e.g. in directory names for documents concerning a patient - better
   * readable than an id). gives something like maier_hans_22.04.1980 or
   * x_unknown_x
   * @param pat {PatientType}
   */
  public createConcern(pat: PatientType) {
    const n1 = pat.bezeichnung1
    const n2 = pat.bezeichnung2
    const n3 = pat.geburtsdatum
    let ret = n1 || 'x'
    ret += '_'
    ret += n2 || 'x'
    ret += '_'
    ret += n3
      ? defs.ElexisDateToLocalDate(n3)
      : 'x'
    return ret
  }
  public async getDecoratedLabel(obj: PatientType): Promise<string>{
    if (!obj) {
      return trl('patient.noneselected')
    }
    let ret = obj.bezeichnung1 + ' ' + obj.bezeichnung2
    if (obj.geschlecht) {
      ret += ` (${obj.geschlecht})`
    }
    if (obj.geburtsdatum) {
      const bd = DateTime.fromFormat(obj.geburtsdatum, 'yyyyLLdd')
      const now = DateTime.local()
      const years = now.diff(bd, 'years')
      ret += `, ${DateTime.fromISO(obj.geburtsdatum).toFormat(
        trl('formatting.date'),
      )}`
      ret += ` (${Math.floor(years.as("years"))})`
    }
    if (obj.patientnr) {
      ret += ' [' + obj.patientnr + ']'
    }
    const sticker = await sm.getFirstSticker(obj.stickers)
    let style = 'color:black;'
    if (sticker) {
      style = `color:#${sticker.foreground || 'black'};background-color:#${sticker.background || 'white'
        };`
    }
    let final = `<span style="${style}">${ret}</span>`
    let images = ''

    if (obj.stickers) {
      for (const name of obj.stickers) {
        const imgdata = await sm.getImage(name)
        if (imgdata) {
          images += `<img src="data:image/png;base64,${imgdata}"
          alt="${name}" style="height:1em;width:1em;padding-left:3px;"
         data-toggle="tooltip" title="${name}">`
        }
      }
    }
    if (images) {
      final += images
    }

    return `<div class="flex flex-row pr-3">${final}</div>`
  }
  public getLabel(obj: PatientType): string {
    if (!obj) {
      return trl('patient.noneselected')
    }
    let ret = obj.bezeichnung1 + ' ' + obj.bezeichnung2
    if (obj.geschlecht) {
      ret += ` (${obj.geschlecht})`
    }
    if (obj.geburtsdatum) {
      const bd = DateTime.fromFormat(obj.geburtsdatum, 'yyyyLLdd')
      const now = DateTime.local()
      const years = now.diff(bd, 'years')
      ret += `, ${DateTime.fromISO(obj.geburtsdatum).toFormat(
        trl('formatting.date'),
      )}`
      ret += ` (${Math.floor(years.as("years"))})`
    }
    if (obj.patientnr) {
      ret += ' [' + obj.patientnr + ']'
    }
    return ret;
  }
  public async getStickersImage(obj: PatientType): Promise<string> {
    const sticker: StickerType = await sm.getFirstSticker(obj.stickers)
    let style = 'color:black;'
    let ret = "";
    if (sticker) {
      style = `color:#${sticker.foreground || 'black'};background-color:#${sticker.background || 'white'
        };`
    }
    let final = `<span style="${style}">${ret}</span>`
    let images = ''

    if (obj.stickers) {
      for (const name of obj.stickers) {
        const imgdata = await sm.getImage(name)
        if (imgdata) {
          images += `<img src="data:image/png;base64,${imgdata}"
          alt="${name}" style="height:1em;width:1em;padding-left:2px;"
         data-toggle="tooltip" title="${name}">`
        }
      }
    }
    if (images) {
      final += images
    }

    return final
  }
  /**
  * create a field definition for detail display in FlexForm or in a new item dialog.
  */
  public getDefinition(): FlexformConfig {
    return {
      title: () => '', // ()=>Patient.getTitle(),
      compact: true,
      attributes: [
        {
          attribute: 'bezeichnung1',
          label: trl('contact.lastname'),
          datatype: 'string',
          validation: this.char80,
          validationMessage: trl('validation.onlyText'),
          sizehint: 4,
        },
        {
          attribute: 'bezeichnung2',
          label: trl('contact.firstname'),
          datatype: 'string',
          validation: this.char80,
          validationMessage: trl('validation.onlyText'),
          sizehint: 4,
        },
        {
          attribute: 'geburtsdatum',
          label: trl('contact.birthdate'),
          datatype: "date",
          validation: this.checkdate,
          validationMessage: trl('validation.invalidDate'),
          sizehint: 2,
        },
        {
          attribute: 'geschlecht',
          label: trl('contact.gender'),
          datatype: 'string',
          sizehint: 2,
        },
        {
          attribute: 'strasse',
          label: trl('address.street'),
          datatype: 'string',
          sizehint: 12,
        },
        {
          attribute: 'plz',
          label: trl('address.zip'),
          datatype: 'string',
          sizehint: 3,
        },
        {
          attribute: 'ort',
          label: trl('address.place'),
          datatype: 'string',
          sizehint: 9,
        } /*{
          attribute: "contactPoints",
          label: i18.tr("contact.contactpoints"),
          datatype: "string",
          sizehint: 12
        }, */,
        {
          attribute: 'telefon1',
          label: trl('contact.phone1'),
          datatype: 'string',
          sizehint: 4,
        },
        {
          attribute: 'telefon2',
          label: trl('contact.phone2'),
          datatype: 'string',
          sizehint: 4,
        },
        {
          attribute: 'natelnr',
          label: trl('contact.mobile'),
          datatype: 'string',
          sizehint: 4,
        },
        {
          attribute: 'email',
          label: trl('contact.email'),
          datatype: 'string',
          sizehint: 6,
        },
        {
          attribute: 'bemerkung',
          label: trl('contact.remark'),
          datatype: 'text',
          sizehint: 12,
        },
        {
          attribute: 'id',
          label: "id",
          datatype: 'readonly',
          sizehint: 12
        }
      ],
    }
  }
  /**
    * Verify that val is a string of 2 to 80 chars length, containing
    * only "normal" characters.
    * @param val
    * @param obj
    */
  public char80(val, obj) {
    if (typeof val == 'string') {
      if (/^[^;\.+"\*%=§<>|,]{2,80}$/i.test(val)) {
        return true
      }
    }
    return false
  }

  /**
   * Check that a date is valid and not in the future
   * @param val
   * @param obj
   */
  public checkdate(val, obj) {
    const m = DateTime.fromISO(val)
    if (m.isValid) {
      if (m < DateTime.local()) {
        return true
      }
    }
    return false
  }
  /**
   * convert a database-style date to a local-style date
   * @param val
   */
  public dateModelToView(val) {
    const m = DateTime.fromFormat(val, 'YYYYMMDD')
    const format = trl('formatting.date')
    const ret = m.toFormat(format)
    return ret
  }

  /**
   * convert a local-style date to a database-style date
   * @param val
   */
  public viewToDateModel(val) {
    const m = DateTime.fromFormat(val, 'D.M.YYYY')
    const ret = m.toFormat(trl("formatting.dbdate"))
    return ret
  }

}


export const patientManager=new PatientManager()
