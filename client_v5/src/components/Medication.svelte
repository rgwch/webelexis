<script lang="ts">
import { prescriptionManager } from "../models";
import {onMount} from 'svelte'
import type { PatientType } from "../models/patient-model";
import type {
  PrescriptionType,
  MEDICATIONDEF,
} from "../models/prescription-model";
import Medicationlist from "./Medicationlist.svelte";
export let entity: PatientType;

let medication: MEDICATIONDEF = {
  fix: [],
  symptom: [],
  reserve: [],
  rezeptdefs: [],
};
prescriptionManager.fetchCurrent(entity?.id).then((result) => {
  medication = result;
});
onMount(){()=>{
    total =
      (window.innerHeight - page_header.getBoundingClientRect().height) *
      0.9;
    part = total / 3 - 10;
    client = part - c_header.getBoundingClientRect().height - 20;
  }
}

  protected selectRezept(rpd?: RpDef) {
    if (rpd) {
      rpd.rezept.type = "rezepte";
      actrpd = rpd;
      we.selectItem(rpd.rezept);
    }
    setTimeout(() => {
      signaler.signal("selected");
      signaler.signal("update");
    }, 100);
  }

  protected createRezept() {
    pm
      .createRezept()
      .then((raw: RezeptType) => {
        const rpd: RpDef = {
          prescriptions: [],
          rezept: raw
        };
        rpdefs.unshift(rpd);
        selectRezept(rpd);
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
      trashstyle = "margin-left:18px;transform: scale(1.5);";
    }
    return true;
  }
  protected dragTrashEnter(event) {
    trashstyle = "margin-left:18px;color:red;";
  }
  protected dragTrashLeave(event) {
    trashstyle = "margin-left:20px;transform:scale(1.0)";
  }
  protected dropTrash(event) {
    event.preventDefault();
    trashstyle = "margin-left:20px;transform:scale(1.0)";

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
      obj.dateuntil = dt.DateToElexisDate(new Date());
      pm.save(obj).then(result => {
        ea.publish(REMOVE_MESSAGE, {
          obj,
          origin: mod,
          source: "trash"
        });
      });
    }
  }
  private actPatientChanged(newValue, oldValue) {
    if (newValue && (!oldValue || newValue.id !== oldValue.id)) {
      searchexpr = "";
      actrpd = undefined;
      refresh(newValue.id).then(() => {
        signaler.signal("selected");
      });
    }
  }

  private refresh(patid: UUID) {
    fixmedi = [];
    symptommedi = [];
    reservemedi = [];
    rpdefs = [];
    actrpd = undefined;

    return pm.fetchCurrent(patid).then(result => {
      fixmedi = result.fix;
      reservemedi = result.reserve;
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
      symptommedi = compacted;
      rpdefs = result.rezeptdefs.sort((a: RpDef, b: RpDef) => {
        return a.rezept.datum.localeCompare(b.rezept.datum) * -1;
      });
    });
  }

  /**
   * User clicked on the printer symbol
   */
  private toPdf() {
    let table = "<table>";
    for (const item of actrpd.prescriptions) {
      const remark = item.bemerkung ? "<br />" + item.bemerkung : "";
      const anzahl = item.anzahl || "1";
      table += `<tr><td>${anzahl}</td><td>${
        item._Artikel.dscr
        }${remark}</td><td>${item.dosis || ""}</td></tr>`;
    }
    table += "</table>";
    const fields = [
      { field: "liste", replace: table },
      { field: "zusatz", replace: actrpd.rezept.rpzusatz }
    ];
    const rp: BriefType = {
      betreff: "Rezept",
      datum: dt.DateToElexisDate(new Date()),
      mimetype: "text/html",
      patientid: actPatient.id,
      typ: "Rezept"
    };
    bm.generate(rp, "rezept", fields).then((processed: BriefType) => {
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
    
       bm.save(processed)
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
g
  /**
   * user clicked on the "rezept" button in Fixmedikation or Reservemedikation
   * @param list 
   * @param from 
   */
  private addToRp(list: PrescriptionType[], from: string) {
    for (const obj of list) {
      ea.publish(ADD_MESSAGE, {
        dest: Modalities.RECIPE,
        from,
        obj
      });
    }
  }
  private makePrescription() {
    ea.publish(SWITCH_PANELS, { left: "rezept" });
    ea.publish("rpPrinter", "Hello, World");
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

</script>

<template>
    <require from="components/searchfield"></require>
    <require from="components/newitem-btn"></require>
    <require from="components/medication"></require>
  
    <span class="detailcaption">Medikation</span>
    <div class="sheet">
      <div class="header" ref="page_header">
        <div class="row">
          <div class="col">
            <searchfield
              t="[searchtext]select.search"
              result.two-way="searchexpr"
            ></searchfield>
          </div>
          <div class="col">
            <img
              class="trash noselect"
              css.bind="trashstyle"
              src="/trash.svg"
              dragover.trigger="dragTrash($event)"
              dragleave.trigger="dragTrashLeave($event)"
              drop.trigger="dropTrash($event)"
            />
          </div>
        </div>
      </div>
      <div class="body" css="height:${total+20}px;overflow:hidden">
        <div class="row">
          <!-- Fixmedikation -->
          <div class="card col" id="card_fixmedi" css="height:${part}px">
            <div class="card-header noselect">
              <span>Fixmedikation</span>
              <img
                class="clickable"
                src="/medical-report.svg"
                alt="Zum Rezept"
                click.delegate="addToRp(fixmedi,mod.FIXMEDI)"
                title="zum Rezept"
              />
            </div>
            <div class="card-body" css="height:${client}px">
              <medication
                list.bind="fixmedi"
                modality="${mod.FIXMEDI}"
                h="${client}px"
              ></medication>
            </div>
          </div>
          <!-- Reservemedikation -->
          <div class="card col" id="card_reservemedi" css="height:${part}px">
            <div class="card-header">
              <span class="noselect">Reservemedikation</span>
              <img
                class="clickable"
                src="/medical-report.svg"
                alt="Zum Rezept"
                click.delegate="addToRp(reservemedi,mod.RESERVE)"
                title="zum Rezept"
              />
            </div>
            <div class="card-body">
              <medication
                list.bind="reservemedi"
                modality="${mod.RESERVE}"
                h="${client}px"
              ></medication>
            </div>
          </div>
        </div>
        <div class="row">
          <!-- Rezeptliste -->
          <div class="card col-3">
            <div class="card-header noselect">
              <span class="noselect">Rezepte</span>
              <new-item-button click.delegate="createRezept()"></new-item-button>
            </div>
            <div class="card-body">
              <div css="overflow:auto;height:${client}px">
                <div
                  class.bind="rpd | selectionClass:actrpd & signal:'selected'"
                  repeat.for="rpd of rpdefs"
                  click.delegate="selectRezept(rpd)"
                >
                  <span class="noselect">${rpd.rezept.datum | dateFormat:"date"}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Momentan ausgewähltes Rezept -->
          <div class="card col-9" id="card_rezept">
            <div class="card-header noselect">
              <span>Rezept</span>
              <img
                class="clickable"
                src="/printer.svg"
                alt="print"
                click.delegate="toPdf(actrezept)"
                title="Druckvorschau"
              />
            </div>
            <div class="card-body">
              <medication
                list.bind="actrpd.prescriptions"
                modality="${mod.RECIPE}"
                h="${client-20}px"
              ></medication>
              <input
                type="text"
                value.bind="actrpd.rezept.rpzusatz"
                style="width:100%;font-size: smaller"
                blur.trigger="pm.saveRezept(actrpd.rezept)"
              />
            </div>
          </div>
        </div>
        <!-- Komplettliste alle Medikamente des Patienten -->
        <div class="card" id="card_symptommedi" css="height:${part+10}px">
          <div class="card-header" ref="c_header">
            <span class="noselect">Nicht (mehr) regelmässig</span>
          </div>
          <div class="card-body">
            <medication
              list.bind="symptommedi"
              modality="${mod.SYMPTOMATIC}"
              h="${client}px"
            ></medication>
          </div>
        </div>
      </div>
    </div>
  
  <!-- div class="flex flex-row">
    <div class="m-3 p-2 flex-1">
      <p>Fixmedikation</p>
      <Medicationlist bind:list="{medication.fix}" />
    </div>
    <div class="m-3 p-2 flex-1">
      <p>Bedarfsmedikation</p>
      <Medicationlist bind:list="{medication.reserve}" />
    </div>
    <div class="m-3 p-2 flex-1">
      <p>Alle Medikamente</p>
      <Medicationlist bind:list="{medication.symptom}" />
    </div>
  </div -->
</template>
