/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2019-2020 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { ICase} from "../models/case-manager"
import { CertificateManager, ICertificate } from './../models/auf-manager';
import { DateTime } from "../services/datetime"
import { IPatient } from "../models/patient-manager"
import { autoinject,bindable } from "aurelia-framework"
import { IElexisType } from "models/elexistype"
import { ValidateEvent } from "aurelia-validation"
import { AppState, SELECTABLE } from './../services/app-state';

// import { BriefType, BriefManager } from "models/briefe-model"

/**
 * Handling of "Arbeitsunfähigkeiten" (work disability certificates; AUF)
 */
@autoinject
export class Certificate {
  @bindable protected actPatient: IPatient
  protected elems = []
  
  constructor(
    private cs: CertificateManager,
    private dt: DateTime,
    private appState:AppState
    // private bm: BriefManager
  ) {
    
  }

  /**
   * User pressed a key in the contenteditable
   * @param event the keypressevent
   * @param auf the auf on which the event happened
   */
  protected key(event, auf) {
    const el = event.target
    if (event.which === 13) {
      const text = el.innerText
      const [begin, end, percent, reason, date, zusatz] = this.splitLine(text)
      if (begin) {
        auf.datumvon = this.dt.localDateToElexisDate(begin)
        auf.datumbis = this.dt.localDateToElexisDate(end)
        auf.prozent = parseInt(percent, 10).toString()
        auf.grund = reason
        auf.aufzusatz = zusatz
        this.cs.save(auf).then(updated => {
          el.blur()
        })
      }
      event.preventDefault()
    } else if (event.which === 27) {
      document.execCommand("undo")
      el.blur()
    }
    return true
  }

  /**
   * Load all certificates of the given patient
   * @param pat
   */
  protected async fetch(pat: IPatient) {
    if (pat) {
      const aufs = await this.cs.find({ patientid: pat.id } )
      this.elems = aufs.data.sort((a, b) => {
        if (!a.datumvon) {
          return -1
        }
        if (!b.datumvon) {
          return 1
        }
        const dd = b.datumvon.localeCompare(a.datumvon)
        if (dd === 0) {
          if (!a.datumauz) {
            return -1
          }
          if (!b.datumauz) {
            return 1
          }
          return b.datumauz.localeCompare(a.datumauz)
        } else {
          return dd
        }
      })
    }
  }

  /**
   * Create a new certificate
   */
  protected newAUF() {
    const fall: ICase = this.appState.getSelectedItem(SELECTABLE.case)
    const today = this.dt.dateToElexisDate(new Date())
    const auftemplate:ICertificate = {
      patientid: this.actPatient.id,
      fallid: fall ? fall.id : undefined,
      prozent: "0",
      datumvon: today,
      datumbis: today,
      grund: fall ? fall.grund : "Krankheit",
      aufzusatz: "",
      briefid: undefined,
      datumauz: today
    }
    this.cs.save(auftemplate).then(created => {
      created.type = "auf"
      this.fetch(this.actPatient)
    })
  }

  /**
   * Print either the currently selected certificate or a list of all selected certificates
   */
  protected print() {
    /*
    const selected: IElexisType[] = this.elems.filter(e => e.selected)
    if (selected.length < 2) {
      const out = selected.length === 1 ? selected[0] : this.elems[0]
      const brief: BriefType = {
        betreff: "AUF-Zeugnis",
        datum: this.dt.DateToElexisDate(new Date()),
        typ: "AUF-Zeugnis",
        mimetype: "text/html",
        _Patient: this.actPatient,
        patientid: this.actPatient ? this.actPatient.id : undefined
      }
      out.type = "auf"
      this.we.selectItem(out)
      this.bm.generate(brief, "auf-zeugnis", []).then(ret => {
        this.bm.print(ret.contents)
      })
    } else {
      const brief: BriefType = {
        betreff: "AUF-Liste",
        datum: this.dt.dateToElexisDate(new Date()),
        typ: "AUF-Zeugnis",
        mimetype: "text/html",
        _Patient: this.actPatient,
        patientid: this.actPatient ? this.actPatient.id : undefined
      }
      let list = "<ul>"
      for (const au of selected as any[]) {
        list +=
          `<li>${this.dt.elexisDateToLocalDate(au.datumvon)} -` +
          `${this.dt.elexisDateToLocalDate(au.datumbis)}: ${au.prozent}% (${au.grund})`
        if (au.aufzusatz) {
          list += `; ${au.aufzusatz}`
        }
        list += "</li>"
      }
      list += "</ul>"
      this.bm
        .generate(brief, "auf-liste", [{ field: "liste", replace: list }])
        .then(ret => {
          this.bm.print(ret.contents)
        })
    }
    */
  }

  /**
   * Check if the input line can be interpreted as content of a certificate
   * @param line
   */
  private splitLine(line) {
    const [begin, end, percent, reason, date, ...zusatz] = line.split(/[\s-:,]+/)
    const proc = parseInt(percent, 10)
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
      return [begin, end, percent, reason, date, zusatz.join(" ")]
    } else {
      alert("Eingabe nicht interpretierbar")
      return []
    }
  }
}

/*
  set item class according to selection Status (needs signal 'selected')
*/
export class SelectionClassValueConverter {
  public toView(item: IElexisType, selected: IElexisType) {
    if (selected && selected.id === item.id) {
      return "highlight-item"
    } else {
      return "compactlist"
    }
  }
}
