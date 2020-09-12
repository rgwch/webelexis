/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2020 by G. Weirich    *
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
import { PatientType } from "../models/patient";
import { WebelexisEvents } from "../webelexisevents";
import { SWITCH_PANELS } from '../routes/dispatch/index';

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
  ) { }

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

  /**
   * Something is dragged to the trash symbol
   * @param event 
   */
  protected dragTrash(event) {
    if (event.dataTransfer.types.find(el => el === "webelexis/modality")) {
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
      mod === Modalities.FIXMEDI ||
      mod === Modalities.RECIPE ||
      mod === Modalities.RESERVE
    ) {
      obj.presctype = Modalities.SYMPTOMATIC;
      delete obj.rezeptid;
      obj.dateuntil = this.dt.DateToElexisDate(new Date());
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
          if (aa.dscr && ba.dscr) {
            return aa.dscr.localeCompare(ba.dscr);
          } else {
            return 0;
          }
        }
      });
      let sign = rest[0];
      const compacted = [];
      for (let i = 0; i < rest.length; i++) {
        const r = rest[i];
        if (r._Artikel && r._Artikel.dscr) {
          if (r._Artikel.dscr === sign._Artikel.dscr) {
            if (r.datefrom < sign.datefrom) {
              sign.datefrom = r.datefrom;
            }
            if (r.dateuntil > sign.dateuntil) {
              sign.dateuntil = r.dateuntil;
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

  /**
   * User clicked on the printer symbol
   */
  private toPdf() {
    let table = "<table>";
    for (const item of this.actrpd.prescriptions) {
      const remark = item.bemerkung ? "<br />" + item.bemerkung : "";
      const anzahl = item.anzahl || "1";
      table += `<tr><td>${anzahl}</td><td>${
        item._Artikel.dscr
        }${remark}</td><td>${item.dosis || ""}</td></tr>`;
    }
    table += "</table>";
    const fields = [
      { field: "liste", replace: table },
      { field: "zusatz", replace: this.actrpd.rezept.rpzusatz }
    ];
    const rp: BriefType = {
      betreff: "Rezept",
      datum: this.dt.DateToElexisDate(new Date()),
      mimetype: "text/html",
      patientid: this.actPatient.id,
      typ: "Rezept"
    };
    this.bm.generate(rp, "rezept", fields).then((processed: BriefType) => {
      const win = window.open("", "_new");
      if (!win) {
        alert(
          "Bitte stellen Sie sicher, dass dieses Programm Popups öffnen darf"
        );
      } else {
        win.document.write(processed.contents);
        // Allow freshly opened window to load css and render
        setTimeout(() => {
          win.print();
        }, 50);
    
       this.bm.save(processed)
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

  /**
   * user clicked on the "rezept" button in Fixmedikation or Reservemedikation
   * @param list 
   * @param from 
   */
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
    this.ea.publish(SWITCH_PANELS, { left: "rezept" });
    this.ea.publish("rpPrinter", "Hello, World");
  }
}

/*
  set item class according to selection Status (needs signal 'selected')
*/
export class SelectionClassValueConverter {
  public toView(item: RpDef, selected: RpDef) {
    if (selected && selected.rezept.id === item.rezept.id) {
      return "highlight-item";
    } else {
      return "compactlist";
    }
  }
}
