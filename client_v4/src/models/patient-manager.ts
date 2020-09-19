import { DateTime } from 'services/datetime';
import { I18N } from 'aurelia-i18n';
import { ObjectManager } from './object-manager';
import { IFlexformConfig } from 'forms/flexform'
import { IKontakt, KontaktManager } from './kontakt-manager';
import { ISticker } from './sticker-manager'
import { autoinject } from 'aurelia-framework'
import * as moment from 'moment'

export interface IPatient extends IKontakt {
  patientnr: string
}

@autoinject
export class PatientManager extends ObjectManager {
  constructor(private km: KontaktManager, private i18: I18N, private dt: DateTime) {
    super('patient')
  }

  getLabel(pat: IPatient) {
    const lbl = this.km.getLabel(pat) + " (" + this.getAge(pat) + ") "
    return lbl + " [" + pat.patientnr + "]"
  }

  getAge(pat: IPatient) {
    const now = moment()
    const bd = moment(pat.geburtsdatum, this.i18.tr("adapters.database_format_date"))
    const age = now.diff(bd, 'years')
    if (age < 2) {
      const mo = now.diff(bd, 'months')
      return age + " " + mo + "/12"
    } else {
      return age
    }
  }

  /**
* create a field definition for detail display in FlexForm or in a new item dialog.
*/
  public getFieldDefinition(): IFlexformConfig {
    return {
      title: () => "", // ()=>Patient.getTitle(),
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

}
