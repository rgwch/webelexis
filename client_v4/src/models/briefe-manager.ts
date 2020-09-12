/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { IPatient } from "./patient-manager";
import { IKontakt } from "./kontakt-manager";
import { autoinject } from "aurelia-framework";
import { IElexisType, UUID, ELEXISDATE, ELEXISDATETIME } from "./elexistype";
import { DateTime } from "services/datetime";
import { ObjectManager } from "./object-manager";
import { IUser, UserManager } from "./user-manager";
import { AppState, SELECTABLE } from '../services/app-state';

/**
 * An Elexis "Brief" (which is an outgoing document)
 */
export interface IBrief extends IElexisType {
  betreff: string;
  datum: ELEXISDATE;
  modifiziert?: ELEXISDATETIME;
  gedruckt?: ELEXISDATE;
  absenderid?: UUID;
  destid?: UUID;
  behandlungsid?: UUID;
  patientid?: UUID;
  _Patient?: IPatient;
  typ:
  | "Vorlagen"
  | "Allg."
  | "AUF-Zeugnis"
  | "Rezept"
  | "Labor"
  | "Bestellung"
  | "Rechnung";
  mimetype: string;
  path?: string;
  note?: string;
  contents?: string;
}

@autoinject
export class BriefManager extends ObjectManager {
  private kontaktService

  constructor(private appState:AppState, private dt: DateTime, private um: UserManager) {
    super("briefe");
    this.kontaktService = this.getDataService("kontakt");
  }


  /**
   * Print-preview a letter
   */
  public print(html: string) {
    const win = window.open("", "_new");
    if (!win) {
      alert(
        "Bitte stellen Sie sicher, dass dieses Programm Popups öffnen darf"
      );
    } else {
      win.document.write(html);
      // Allow freshly opened window to load css and render
      setTimeout(() => {
        win.print();
      }, 50);
    }
  }

  /**
   * Generate a letter (which means: merge a template with a number of field definitions and system constants)
   * @param brief: BriefType
   * @param template: string - Name of the Template to use. The system will attach the suffix _webelexis to the name
   * to avoid name clash with templates from other document systems.
   * @param fields Array of {field: string, replace: string}
   * @throws "Template not found", if the template '${name}_webelexis' could not be loaded.
   * @returns A Promise with a clone of the input brief, contents filled with the processed template.
   */
  public async generate(
    brief: IBrief,
    template: string,
    fields?: Array<{ field: string; replace: string }>
  ): Promise<IBrief> {
    if (!template.endsWith("_webelexis")) {
      template += "_webelexis";
    }
    const tmpls = await this.dataService.find({
      query: { betreff: template, typ: "Vorlagen" }
    });
    if (tmpls.data.length > 0) {
      const tmpl: IBrief = await this.dataService.get(tmpls.data[0].id) as any
      const compiled = await this.replaceFields(tmpl.contents, brief, fields);
      return Object.assign({}, brief, { contents: compiled })
      //return compiled;
    } else {
      throw new Error("Template " + template + " not found");
    }
  }
  /**
   * Replace fields in the template with data from the 'brief' and fields from an array.
   * First scan the template for fieldnames enclosed in [brackets] matching the names in the fields-Array
   * and replace them with the values in the field array.
   * Second, scan for fields of the form [datatype.attribute] and replace them with the currently active
   * instance of the datatype and the named attribute therof.
   * @param template An html template with some fields to replace in the form [fieldname] or [datatype.attribute]
   * @param brief: BriefType
   * @param fields: An Array of {field: fieldname, replace: string}
   * @returns The template with all variable fields replaced
   */
  public async replaceFields(
    template: string,
    brief: IBrief,
    fields?: Array<{ field: string; replace: string }>
  ) {
    const fieldmatcher = /\[\w+?\.\w+?\]/gi;
    const complexmatcher = /\[\w+?:\w+?:.+?\/.+?\]/gi;

    for (const f of fields) {
      if (!f.replace) {
        f.replace = "";
      }
      template = template.replace("[" + f.field + "]", f.replace);
    }
    const stepOne = template.replace(
      /\[Datum.heute\]/g,
      this.dt.dateToLocalDate(new Date())
    );
    // console.log("stepOne: " + stepOne)

    let destinator: IKontakt;
    let concerning: IKontakt;
    let user: IUser;
    let mandator: IKontakt;
    try {
      destinator = await this.findKontakt(brief, "destid", "_Dest");
      concerning = await this.findKontakt(brief, "patientid", "_Patient");
      user = this.appState.getSelectedItem(SELECTABLE.user)
      mandator = await this.um.getActiveMandatorFor(user)
    } catch (err) {
      console.log(err);
    }
    const getEntity = (desc: string): IKontakt => {
      let entity: IKontakt;
      switch (desc.toLowerCase()) {
        case "adressat":
        case "addressee":
          entity = destinator;
          break;
        case "patient":
        case "concern":
          entity = concerning;
          break;
        default:
          entity = this.appState.getSelectedItem(desc);
      }
      return entity;
    };
    // [patient:mw:er/sie], [adressat:mwn:er/sie/unpers]
    const stepTwo = stepOne.replace(complexmatcher, field => {
      const full = field.substring(1, field.length - 1);
      const parts = full.split(":");
      // console.log("parts :", parts)
      const entity = getEntity(parts[0]);
      if (parts[1] === "mw") {
        const v1 = parts[2].split("/");
        if (entity.geschlecht && entity.geschlecht.toLowerCase() === "m") {
          return v1[0];
        } else {
          return v1[1];
        }
      }
      return field;
    });
    // console.log("Step 2 " + stepTwo)
    const stepThree = stepTwo.replace(fieldmatcher, field => {
      const value = field.substring(1, field.length - 1);
      const [element, attribute] = value.split(".");
      let replacement: string = "";

      const entity = getEntity(element);
      if (entity) {
        replacement = entity[attribute.toLowerCase()];
        if (!replacement) {
          if (entity.extjson) {
            replacement = entity.extjson[attribute]
          }
        }
      } else {
        replacement = ""
      }

      if (replacement) {
        if (replacement.match(/[0-9]{8,8}/)) {
          replacement = this.dt.elexisDateToLocalDate(replacement);
        }
        return replacement;
      } else {
        return "" // field;
      }
    });
    return stepThree;
  }

  /**
   * Fetch a related kontakt from the id in the field denoted by 'flat'.
   * To reduce number of net accesses, once a kontakt is fetched, we store it in the field denoted by
   * 'fold'. So, on as subseqent call, we can just return the value of tmpl[fold].
   */
  private findKontakt = async (tmpl, flat, fold): Promise<IKontakt> => {
    if (tmpl[fold]) {
      return tmpl[fold];
    } else if (tmpl[flat]) {
      tmpl[fold] = await this.kontaktService.get(tmpl[flat]);
      return tmpl[fold];
    } else {
      console.log("not found %s", tmpl);
      return undefined;
    }
  };
}
