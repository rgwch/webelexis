<script lang="ts">
import { Billing } from "../services/billing";
import type { BillingsFilter } from "../services/filter";
import { Filter } from "../services/filter";
import type { konsdef } from "../services/billing";
import { Tree } from "../models/tree";
import TreeView from "../widgets/TreeView.svelte";
import { DateTime } from "luxon";
import { CaseManager} from "../models/case-model";
import type { CaseType } from "../models/case-model";
import { EncounterManager } from "../models/encounter-model";
import type { EncounterType } from "../models/encounter-model";
import { patientManager as pm, type PatientType} from "../models/patient-model";
import PatientDetail from "./PatientDetail.svelte";
import FallDetail from "./FallDetail.svelte";
import EncounterDetail from "./EncounterDetail.svelte";
import SelectOptions from "./SelectOptions.svelte";
import Modal from "../widgets/Modal.svelte";
import { _ } from "svelte-i18n";

const cm = new CaseManager();
const em = new EncounterManager();
let patients: Array<Tree<konsdef>> = [];

let tSelected: Array<Tree<konsdef>> = [];
let selectedElement: any;
const biller = new Billing();
let selector = false;
let deselector = false;
let longrunning = false;
biller.getBillables().then((result) => {
  patients = result.getChildren();
});

const labelProvider: (x: Tree<any>) => string = (node: Tree<any>) => {
  switch (node.props.type) {
    /*
    case "p": return Patient.getLabel(node.payload.Patient)
    case "c": return cm.getLabel(node.payload.Fall)
    case "e": return em.getSimpleLabel(node.payload.Konsultation)
    */
    case "p":
      return (
        node.payload.lastname +
        " " +
        node.payload.firstname +
        ", " +
        DateTime.fromISO(node.payload.birthdate).toLocaleString()
      );
    case "c":
      return (
        "Fall vom " +
        DateTime.fromISO(node.payload.falldatum).toLocaleString() +
        "(" +
        node.payload.falltitel +
        ")"
      );
    case "e":
      return (
        "Konsultation vom " +
        DateTime.fromISO(node.payload.konsdatum).toLocaleString()
      );
    default:
      throw new Error("unknown node def " + JSON.stringify(node.props));
  }
};

async function detailDisplay(node: Tree<konsdef>) {
  selectedElement = undefined;
  switch (node.props.type) {
    case "p":
      selectedElement = await getPatient(node);
      break;
    case "c":
      selectedElement = await getFall(node);
      break;
    case "e":
      selectedElement = await getEncounter(node);
      break;
    default:
      throw new Error("bad konsdef");
  }
}
async function getPatient(t: Tree<konsdef>): Promise<PatientType> {
  if (!t.payload.Patient) {
    t.payload.Patient = await pm.fetch(t.payload.patientid);
  }
  return t.payload.Patient;
}
async function getFall(t: Tree<konsdef>): Promise<CaseType> {
  if (!t.payload.Fall) {
    t.payload.Fall = await cm.fetch(t.payload.fallid);
  }
  return t.payload.Fall;
}
async function getEncounter(t: Tree<konsdef>): Promise<EncounterType> {
  if (!t.payload.Konsultation) {
    t.payload.Konsultation = await em.fetch(t.payload.konsid);
  }
  return t.payload.Konsultation;
}
let selectOptions: BillingsFilter = { bSelected: true };

async function doSelect() {
  const eliminate = [];
  tSelected = tSelected || [];
  longrunning = true;
  const temp = new Tree<konsdef>(null, null);
  const filter = new Filter();
  for (let i = patients.length - 1; i >= 0; i--) {
    const node = patients[i];
    if (await filter.applyBillingsFilter(node, selectOptions)) {
      tSelected = [...tSelected, node].sort((a, b) =>
        a.payload.lastname.localeCompare(b.payload.lastname)
      );
      patients.splice(i, 1);
    }
  }
  patients = patients;
  longrunning = false;
}

let deselectOptions: BillingsFilter = {};
async function doDeselect() {
  const eliminate = [];
  longrunning = true;
  const filter = new Filter();
  for (let i = tSelected.length - 1; i >= 0; i--) {
    const node = tSelected[i];
    if (await filter.applyBillingsFilter(node, deselectOptions)) {
      // console.log("removing " + node.payload.lastname);
      patients.push(node);
      tSelected.splice(i, 1);
    }
  }
  patients = patients.sort((a, b) =>
    a.payload.lastname.localeCompare(b.payload.lastname)
  );

  tSelected = tSelected;
  longrunning = false;
}
async function createBills() {
  const bills = [];
  for (const p of tSelected) {
    for (const fall of p.getChildren()) {
      try {
        bills.push(await biller.createBill(fall));
      } catch (error) {
        alert(
          "Error with " +
            p.payload.lastname +
            " " +
            p.payload.firstname +
            ": " +
            error
        );
      }
    }
  }
  tSelected = [];
  return bills;
}
</script>

<template>
  {#if longrunning}
    <img
      class="justify-center relative left-20"
      src="webelexis-anim.gif"
      width="150px"
      alt="wait..." />
  {/if}
  {#if selector}
    <Modal
      title="{$_('actions.select')}"
      dismiss="{(ok) => {
        selector = false;
        if (ok) {
          doSelect();
        }
      }}">
      <div slot="body"><SelectOptions options="{selectOptions}" /></div>
    </Modal>
  {/if}
  {#if deselector}
    <Modal
      title="{$_('actions.deselect')}"
      dismiss="{(ok) => {
        deselector = false;
        if (ok) {
          doDeselect();
        }
      }}">
      <div slot="body"><SelectOptions options="{deselectOptions}" /></div>
    </Modal>
  {/if}
  <div class="flex flex-row">
    <div class="border-2 border-solid border-blue-400 rounded m-2 flex-1">
      <h2 class="mx-3">
        {$_("titles.unbilled")} ({patients.length})<span
          class="ml-4 text-sm cursor-pointer underline hover:text-blue-600 rounded-full"
          on:click="{() => {
            selector = true;
          }}">{$_("actions.select")}</span>
      </h2>
      <TreeView
        bind:trees="{patients}"
        labelProvider="{labelProvider}"
        on:selected="{(event) => detailDisplay(event.detail)}" />
    </div>

    <div class="border-2 border-solid border-blue-400 rounded m-2 flex-1">
      <h2 class="mx-3">
        {$_("titles.selected")} ({tSelected.length})<span
          class="ml-4 text-sm cursor-pointer underline hover:text-blue-600"
          on:click="{() => {
            deselector = true;
          }}">{$_("actions.deselect")}</span>
      </h2>

      <TreeView
        bind:trees="{tSelected}"
        labelProvider="{labelProvider}"
        on:selected="{(event) => detailDisplay(event.detail)}" />
      <button
        class="bg-blue-500 font-bolder text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 rounded-full"
        on:click="{createBills}">
        {$_("billing.actions.create")}
      </button>
    </div>
    <div class="border-2 border-solid border-blue-400 rounded m-2 flex-1">
      {#if selectedElement?.geburtsdatum}
        <PatientDetail entity="{selectedElement}" />
      {:else if selectedElement?.patientid}
        <FallDetail entity="{selectedElement}" />
      {:else if selectedElement?.fallid}
        <EncounterDetail entity="{selectedElement}" />
      {/if}
    </div>
  </div>
</template>
