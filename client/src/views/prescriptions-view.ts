/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, LogManager } from "aurelia-framework";
import { connectTo } from "aurelia-store";
import { BindingSignaler } from "aurelia-templating-resources";
import { BriefManager, BriefType } from "models/briefe-model";
import { ElexisType, UUID } from "models/elexistype";
import { PatientManager } from "models/patient";
import {
  Modalities,
  PrescriptionManager,
  PrescriptionType,
  RezeptType,
  RpDef
} from "models/prescription-model";
import { pluck } from "rxjs/operators";
import { DateTime } from "services/datetime";
import { State } from "state";
import { ADD_MESSAGE, REMOVE_MESSAGE } from "../components/medication";
import { DocManager, DocType } from "../models/document-model";
import { PatientType } from "./../models/patient";
import { WebelexisEvents } from "./../webelexisevents";
import "./prescription-view.scss";

// import * as html2pdf from 'html2pdf.js'

const log = LogManager.getLogger("prescriptions-view");

@autoinject
@connectTo<State>({
  selector: {
    actPatient: store => store.state.pipe(pluck("patient") as any)
  }
})
export class Prescriptions {
  public fixmedi: PrescriptionType[] = [];
  public reservemedi: PrescriptionType[] = [];
  public symptommedi: PrescriptionType[] = [];
  public rpdefs: RpDef[] = [];
  public actrpd: RpDef = undefined;
  public searchexpr = "";
  protected rezeptZusatz: string;
  protected page_header: Element;
  protected c_header: Element;
  protected total: number;
  protected part: number;
  protected client: number;
  private mod = Modalities;
  private trashstyle = "margin-left:20px";
  private log;
  private actPatient: PatientType;

  constructor(
    private pm: PrescriptionManager,
    private ea: EventAggregator,
    private signaler: BindingSignaler,
    private bm: BriefManager,
    private dt: DateTime,
    private dm: DocManager,
    private patm: PatientManager,
    private we: WebelexisEvents
  ) {}

  public attached() {
    this.total =
      (window.innerHeight - this.page_header.getBoundingClientRect().height) *
      0.9;
    this.part = this.total / 3 - 10;
    this.client = this.part - this.c_header.getBoundingClientRect().height - 20;
  }

  protected selectRezept(rpd?: RpDef) {
    if (rpd) {
      rpd.rezept.type = "rezepte";
      this.actrpd = rpd;
      this.we.selectItem(rpd.rezept);
    }
    setTimeout(() => {
      this.signaler.signal("selected");
      this.signaler.signal("update");
    }, 100);
  }

  protected createRezept() {
    this.pm
      .createRezept()
      .then((raw: RezeptType) => {
        const rpd: RpDef = {
          prescriptions: [],
          rezept: raw
        };
        this.rpdefs.unshift(rpd);
        this.selectRezept(rpd);
        return rpd;
      })
      .catch(err => {
        console.log(err);
        alert("Konnte kein Rezept erstellen");
      });
  }

  protected dragTrash(event) {
    if (event.dataTransfer.types.find(el => el == "webelexis/modality")) {
      event.preventDefault();
      this.trashstyle = "margin-left:18px;transform: scale(1.5);";
    }
    return true;
  }
  protected dragTrashEnter(event) {
    this.trashstyle = "margin-left:18px;color:red;";
  }
  protected dragTrashLeave(event) {
    this.trashstyle = "margin-left:20px;transform:scale(1.0)";
  }
  protected dropTrash(event) {
    event.preventDefault();
    this.trashstyle = "margin-left:20px;transform:scale(1.0)";

    const obj: PrescriptionType = JSON.parse(
      event.dataTransfer.getData("webelexis/object")
    );
    const mod = event.dataTransfer.getData("webelexis/modality");
    // console.log("trash: " + obj + ", " + mod);
    if (
      mod == Modalities.FIXMEDI ||
      mod == Modalities.RECIPE ||
      mod == Modalities.RESERVE
    ) {
      obj.prescType = Modalities.SYMPTOMATIC;
      delete obj.REZEPTID;
      obj.DateUntil = this.dt.DateToElexisDate(new Date());
      this.pm.save(obj).then(result => {
        this.ea.publish(REMOVE_MESSAGE, {
          obj,
          origin: mod,
          source: "trash"
        });
      });
    }
  }
  private actPatientChanged(newValue, oldValue) {
    if (newValue && (!oldValue || newValue.id !== oldValue.id)) {
      this.searchexpr = "";
      this.actrpd = undefined;
      this.refresh(newValue.id).then(() => {
        this.signaler.signal("selected");
      });
    }
  }

  private refresh(patid: UUID) {
    this.fixmedi = [];
    this.symptommedi = [];
    this.reservemedi = [];
    this.rpdefs = [];
    this.actrpd = undefined;

    return this.pm.fetchCurrent(patid).then(result => {
      this.fixmedi = result.fix;
      this.reservemedi = result.reserve;
      const rest = result.symptom.sort((a, b) => {
        if (a._Artikel && b._Artikel) {
          const aa = a._Artikel;
          const ba = b._Artikel;
          if (aa.DSCR && ba.DSCR) {
            return aa.DSCR.localeCompare(ba.DSCR);
          } else {
            return 0;
          }
        }
      });
      let sign = rest[0];
      const compacted = [];
      for (let i = 0; i < rest.length; i++) {
        const r = rest[i];
        if (r._Artikel && r._Artikel.DSCR) {
          if (r._Artikel.DSCR === sign._Artikel.DSCR) {
            if (r.DateFrom < sign.DateFrom) {
              sign.DateFrom = r.DateFrom;
            }
            if (r.DateUntil > sign.DateUntil) {
              sign.DateUntil = r.DateUntil;
            }
          } else {
            compacted.push(sign);
            sign = rest[i];
          }
        }
      }
      this.symptommedi = compacted;
      this.rpdefs = result.rezeptdefs.sort((a: RpDef, b: RpDef) => {
        return a.rezept.datum.localeCompare(b.rezept.datum) * -1;
      });
    });
  }

  private toPdf() {
    let table = "<table>";
    for (const item of this.actrpd.prescriptions) {
      const remark = item.Bemerkung ? "<br />" + item.Bemerkung : "";
      const anzahl = item.ANZAHL || "1";
      table += `<tr><td>${anzahl}</td><td>${
        item._Artikel.DSCR
      }${remark}</td><td>${item.Dosis || ""}</td></tr>`;
    }
    table += "</table>";
    const fields = [
      { field: "liste", replace: table },
      { field: "zusatz", replace: this.actrpd.rezept.RpZusatz }
    ];
    const rp: BriefType = {
      Betreff: "Rezept",
      Datum: this.dt.DateToElexisDate(new Date()),
      MimeType: "text/html",
      patientid: this.actPatient.id,
      typ: "Rezept"
    };
    this.bm.generate(rp, "rezept", fields).then(html => {
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
        /*
        const domdoc = win.document.body
        const worker=new html2pdf.Worker
        worker.from(domdoc).toPdf().thenExternal(rs=>{
          console.log(rs)
        })*/
        const wlxdoc: DocType = {
          category: "Ausgang",
          concern: this.patm.createConcern(this.actPatient),
          date: rp.Datum,
          payload: html,
          subject: "Rezept"
        };
        this.dm.store(wlxdoc).catch(err => {
          // alert("Fehler beim Speichern")
        });
      }
    });
  }

  private findId(element) {
    if (element.id.startsWith("card_")) {
      return element.id.subString(5);
    }
    if (element.parentElement.id.startsWith("card_")) {
      return element.parentElement.id.substring(5);
    }
  }

  private addToRp(list: PrescriptionType[], from: string) {
    for (const obj of list) {
      this.ea.publish(ADD_MESSAGE, {
        dest: Modalities.RECIPE,
        from,
        obj
      });
    }
  }
  private makePrescription() {
    this.ea.publish("left_panel", "rezept");
    this.ea.publish("rpPrinter", "Hello, World");
  }
}

/*
  set item class according to selection Status (needs signal 'selected')
*/
export class SelectionClassValueConverter {
  public toView(item: RpDef, selected: RpDef) {
    if (selected && selected.rezept.id == item.rezept.id) {
      return "highlight-item";
    } else {
      return "compactlist";
    }
  }
}
