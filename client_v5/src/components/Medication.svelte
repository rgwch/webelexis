<script lang="ts">
import { prescriptionManager, briefManager } from "../models";
import type { UUID } from "../models/elexistype";
import { onMount } from "svelte";
import type { PatientType } from "../models/patient-model";
import props from "../services/properties";
import { Modalities } from "../models/prescription-model";
import Card from "../widgets/Card.svelte";
import Fa from "svelte-fa";
import { _ } from "svelte-i18n";
import defs from "../services/util";
import {
  faTrash,
  faPrescription,
  faPrint,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import type {
  PrescriptionType,
  RezeptType,
  MEDICATIONDEF,
  RpDef,
} from "../models/prescription-model";
import Medicationlist from "./Medicationlist.svelte";
import {
  currentRezept,
  currentActor,
  currentPatient,
  messageBroker as mb,
} from "../services/store";
import type { BriefType } from "../models/briefe-model";
export let entity: PatientType;
let actrpd: RpDef;
let rpdefs: Array<RpDef> = [];
let trashstyle = "margin-left:20px";
let searchexpr: string = "";

let medication: MEDICATIONDEF = {
  fix: [],
  symptom: [],
  reserve: [],
  rezeptdefs: [],
};
/*
prescriptionManager.fetchCurrent(entity?.id).then((result) => {
  medication = result;
});
*/
onMount(() => {
  refresh(entity.id);
});

function selectRezept(rpd?: RpDef) {
  if (rpd) {
    rpd.rezept.type = "rezepte";
    actrpd = rpd;
    currentRezept.set(rpd.rezept);
  }
  /*
    setTimeout(() => {
      signaler.signal("selected");
      signaler.signal("update");
    }, 100);
    */
}

function createRezept() {
  prescriptionManager
    .createRezept(entity, $currentActor)
    .then((raw: RezeptType) => {
      const rpd: RpDef = {
        prescriptions: [],
        rezept: raw,
      };
      rpdefs = [rpd, ...rpdefs];
      // rpdefs.unshift(rpd);
      selectRezept(rpd);
      return rpd;
    })
    .catch((err) => {
      console.log(err);
      alert($_("medication.rperror"));
    });
}

/**
 * Something is dragged to the trash symbol
 * @param event
 */
function dragTrash(event) {
  if (event.dataTransfer.types.find((el) => el === "webelexis/modality")) {
    event.preventDefault();
    trashstyle = "margin-left:18px;transform: scale(1.5);";
  }
  return true;
}
function dragTrashEnter(event) {
  trashstyle = "margin-left:18px;color:red;";
}
function dragTrashLeave(event) {
  trashstyle = "margin-left:20px;transform:scale(1.0)";
}
function dropTrash(event) {
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
    obj.dateuntil = defs.DateToElexisDate(new Date());
    prescriptionManager.save(obj).then((result) => {
      mb.publish(props.REMOVE_MESSAGE, {
        obj,
        origin: mod,
        source: "trash",
      });
    });
  }
}
function actPatientChanged(newValue, oldValue) {
  if (newValue && (!oldValue || newValue.id !== oldValue.id)) {
    searchexpr = "";
    actrpd = undefined;
    refresh(newValue.id).then(() => {
      // signaler.signal("selected");
    });
  }
}

async function refresh(patid: UUID) {
  // medication={fix:[],reserve:[],symptom:[], rezeptdefs:[]}
  actrpd = undefined;
  let fixmedi: Array<PrescriptionType>;
  let reservemedi: Array<PrescriptionType>;
  let symptommedi: Array<PrescriptionType>;
  const result = await prescriptionManager.fetchCurrent(patid);
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
  medication = {
    fix: fixmedi,
    reserve: reservemedi,
    symptom: symptommedi,
    rezeptdefs: result.rezeptdefs,
  };
}

/**
 * User clicked on the printer symbol
 */
async function toPdf(rezept) {
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
    { field: "zusatz", replace: actrpd.rezept.rpzusatz },
  ];
  const rp: BriefType = {
    betreff: "Rezept",
    datum: defs.DateToElexisDate(new Date()),
    mimetype: "text/html",
    patientid: $currentPatient.id,
    typ: "Rezept",
  };
  try {
    const processed = await briefManager.generate(rp, "rezept", fields);
    await briefManager.print(processed.contents);
    await briefManager.save(processed);
  } catch (err) {
    alert(err);
  }
}

function findId(element) {
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
function addToRp(list: PrescriptionType[], from: string) {
  for (const obj of list) {
    mb.publish(props.ADD_MESSAGE, {
      dest: Modalities.RECIPE,
      from,
      obj,
    });
  }
}

function makePrescription() {
  /*
  mb.publish(SWITCH_PANELS, { left: "rezept" });
  mb.publish("rpPrinter", "Hello, World");
  */
}

function dateToScreen(date: string) {
  return defs.ElexisDateToLocalDate(date);
}
</script>

<template>
  <Card>
    <div slot="heading">
      <div class="flex">
        <input bind:value="{searchexpr}" />
        <span
          class="text-gray-600 hover:text-green-700 mx-4 my-2"
          on:dragenter="{dragTrashEnter}"
          on:dragover="{dragTrash}"
          on:dragleave="{dragTrashLeave}"
          on:drop="{dropTrash}">
          <Fa icon="{faTrash}" size="lg" />
        </span>
      </div>
    </div>
    <div slot="body">
      <div class="flex">
        <div class="flex-1">
          <!-- Fixmedikation -->
          <Card>
            <div slot="heading">
              <span>{$_("medication.fix")}</span>
              <span
                class="mx-3 px-1 cursor-pointer"
                on:click="{() => addToRp(medication.fix, Modalities.FIXMEDI)}"
                ><Fa icon="{faPrescription}" /></span>
            </div>
            <div slot="body">
              <Medicationlist
                bind:list="{medication.fix}"
                modality="{Modalities.FIXMEDI}" />
            </div>
          </Card>
        </div>
        <div class="flex-1">
          <!-- Reservemedikation -->
          <Card>
            <div slot="heading">
              <span>{$_("medication.reserve")}</span>
              <span
                class="mx-3 px-2 cursor-pointer"
                on:click="{() => {
                  addToRp(medication.reserve, Modalities.RESERVE);
                }}"><Fa icon="{faPrescription}" /></span>
            </div>
            <div slot="body">
              <Medicationlist
                bind:list="{medication.reserve}"
                modality="{Modalities.RESERVE}" />
            </div>
          </Card>
        </div>
      </div>
      <div class="flex">
        <div>
          <!-- Rezepte -->
          <Card>
            <div slot="heading">
              <span>{$_("medication.prescriptions")}</span>
              <span
                class="text-green-500 mx-3 cursor-pointer"
                on:click="{() => createRezept()}"><Fa icon="{faStar}" /></span>
            </div>
            <div slot="body">
              <div class="max-h-[8rem] h-[8rem] overflow-y-auto">
                {#each rpdefs as rpd}
                  <div
                    class="cursor-pointer"
                    on:click="{() => selectRezept(rpd)}">
                    <span class="noselect"
                      >{dateToScreen(rpd.rezept.datum)}</span>
                  </div>
                {/each}
              </div>
            </div>
          </Card>
        </div>
        <div class="flex-1">
          <!-- Ausgewähltes Rezept -->
          <Card>
            <div slot="heading">
              <span>{$_("medication.prescription")}</span>
              <span
                title="Druckvorschau"
                on:click="{() => toPdf($currentRezept)}"
                ><Fa icon="{faPrint}" /></span>
            </div>
            <div slot="body">
              {#if actrpd}
                <Medicationlist
                  bind:list="{actrpd.prescriptions}"
                  modality="{Modalities.RECIPE}" />
                <input
                  type="text"
                  bind:value="{actrpd.rezept.rpzusatz}"
                  style="width:100%;font-size: smaller"
                  on:blur="{prescriptionManager.saveRezept(actrpd.rezept)}" />
              {/if}
            </div>
          </Card>
        </div>
      </div>

      <!-- Komplettliste alle Medikamente des Patienten -->
      <div>
        <Card>
          <div slot="heading">
            <span class="noselect">{$_("medication.other")}</span>
          </div>
          <div slot="body">
            <Medicationlist
              bind:list="{medication.symptom}"
              modality="{Modalities.SYMPTOMATIC}" />
          </div>
        </Card>
      </div>
    </div>
  </Card>
</template>
