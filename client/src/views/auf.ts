import { select } from 'd3-selection';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2019 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { CaseType } from "./../models/case";
import { DateTime } from "./../services/datetime";
import { WebelexisEvents } from "./../webelexisevents";
import { PatientType } from "./../models/patient";
import { State } from "./../state";
import { connectTo } from "aurelia-store";
import { autoinject } from "aurelia-framework";
import { DataSource, DataService } from "services/datasource";
import { pluck } from "rxjs/operators";
import { ElexisType } from "models/elexistype";
import { ValidateEvent } from "aurelia-validation";
import { FromViewBindingBehavior } from "aurelia-templating-resources";
import { BriefType, BriefManager } from "models/briefe-model";

/**
 * Handling of "Arbeitsunfähigkeiten" (work disability certificates; AUF)
 */
@autoinject
@connectTo<State>({
  selector: {
    actPatient: store => store.state.pipe(pluck("patient") as any)
  }
})
export class AUF {
  protected actPatient: PatientType;
  protected elems = [];
  private aufService: DataService;

  constructor(
    ds: DataSource,
    private we: WebelexisEvents,
    private dt: DateTime,
    private bm: BriefManager
  ) {
    this.aufService = ds.getService("auf");
  }

  public actPatientChanged(newpat: PatientType, oldpat?: PatientType) {
    this.fetch(newpat);
  }
  /**
   * User pressed a key in the contenteditable
   * @param event the keypressevent
   * @param auf the auf on which the event happened
   */
  protected key(event, auf) {
    const el = event.target;
    if (event.which === 13) {
      const text = el.innerText;
      const [begin, end, percent, reason, date, zusatz] = this.splitLine(text);
      if (begin) {
        auf.datumvon = this.dt.localDateToElexisDate(begin);
        auf.datumbis = this.dt.localDateToElexisDate(end);
        auf.prozent = parseInt(percent, 10).toString();
        auf.grund = reason;
        auf.AUFZusatz = zusatz;
        this.aufService.update(auf.id, auf).then(updated => {
          el.blur();
        });
      }
      event.preventDefault();
    } else if (event.which === 27) {
      document.execCommand("undo");
      el.blur();
    }
    return true;
  }

  /**
   * Load all certificates of the given patient
   * @param pat 
   */
  protected async fetch(pat: PatientType) {
    if (pat) {
      const aufs = await this.aufService.find({ query: { patientid: pat.id } });
      this.elems = aufs.data.sort((a, b) => {
        const dd = b.datumvon.localeCompare(a.datumvon);
        if (dd === 0) {
          return b.DatumAUZ.localeCompare(a.DatumAUZ);
        } else {
          return dd;
        }
      });
    }
  }

  /**
   * Create a new certificate
   */
  protected newAUF() {
    const fall: CaseType = this.we.getSelectedItem("fall");
    const today = this.dt.DateToElexisDate(new Date());
    const auftemplate = {
      patientid: this.actPatient.id,
      fallid: fall ? fall.id : undefined,
      prozent: "0",
      datumvon: today,
      datumbis: today,
      Grund: fall ? fall.grund : "Krankheit",
      AUFZusatz: "",
      BriefID: undefined,
      DatumAUZ: today
    };
    this.aufService.create(auftemplate).then(created => {
      created.type = "auf";
      this.we.selectItem(created);
      this.fetch(this.actPatient);
    });
  }

  /**
   * Print either the currently selected certificate or a list of all selected certificates
   */
  protected print() {
    const selected: ElexisType[] = this.elems.filter(e => e.selected);
    if (selected.length < 2) {
      const out = (selected.length === 1 ? selected[0] : this.elems[0])
      const brief: BriefType = {
        Betreff: "AUF-Zeugnis",
        Datum: this.dt.DateToElexisDate(new Date()),
        typ: "AUF-Zeugnis",
        MimeType: "text/html",
        _Patient: this.actPatient,
        patientid: this.actPatient ? this.actPatient.id : undefined
      };
      out.type = "auf"
      this.we.selectItem(out)
      this.bm.generate(brief, "auf-zeugnis", []).then(html => {
        this.bm.print(html);
      });
    } else {
      const brief: BriefType = {
        Betreff: "AUF-Liste",
        Datum: this.dt.DateToElexisDate(new Date()),
        typ: "AUF-Zeugnis",
        MimeType: "text/html",
        _Patient: this.actPatient,
        patientid: this.actPatient ? this.actPatient.id : undefined
      };
      let list = "<ul>"
      for (const au of selected as any[]) {
        list += `<li>${this.dt.ElexisDateToLocalDate(au.datumvon)} -`
          + `${this.dt.ElexisDateToLocalDate(au.datumbis)}: ${au.prozent}% (${au.Grund})`
        if (au.AUFZusatz) {
          list += `; ${au.AUFZusatz}`
        }
        list += "</li>"
      }
      list += "</ul>"
      this.bm.generate(brief, "auf-liste", [{ field: "liste", replace: list }]).then(html => {
        this.bm.print(html)
      })
    }

  }

  /**
   * Check if the input line can be interpreted as content of a certificate
   * @param line 
   */
  private splitLine(line) {
    const [begin, end, percent, reason, date, ...zusatz] = line.split(
      /[\s-:,]+/
    );
    const proc = parseInt(percent, 10);
    if (
      begin &&
      this.dt.isValidLocalDate(begin) &&
      end &&
      this.dt.isValidLocalDate(end) &&
      proc &&
      proc >= 0 &&
      proc <= 100 &&
      date &&
      this.dt.isValidLocalDate(date.substr(1, date.length - 2))
    ) {
      return [begin, end, percent, reason, date, zusatz.join(" ")];
    } else {
      alert("Eingabe nicht interpretierbar");
      return [];
    }
  }
}

/*
  set item class according to selection Status (needs signal 'selected')
*/
export class SelectionClassValueConverter {
  public toView(item: ElexisType, selected: ElexisType) {
    if (selected && selected.id === item.id) {
      return "highlight-item";
    } else {
      return "compactlist";
    }
  }
}
