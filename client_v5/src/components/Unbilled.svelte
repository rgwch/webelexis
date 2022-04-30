<script lang="ts">
import { Billing } from "../services/billing";
import type { BillingsFilter } from "../services/billing";
import type { konsdef } from "../services/billing";
import { Tree } from "../models/tree";
import type { ITreeListener } from "../models/tree";
import TreeView from "../widgets/TreeView.svelte";
import { DateTime } from "luxon";
import { CaseManager } from "../models/case-model";
import type { CaseType } from "../models/case-model";
import { EncounterManager } from "../models/encounter-model";
import type { EncounterType } from "../models/encounter-model";
import { Patient, PatientManager } from "../models/patient-model";
import PatientDetail from "./PatientDetail.svelte";
import FallDetail from "./FallDetail.svelte";
import EncounterDetail from "./EncounterDetail.svelte";
import SelectOptions from "./SelectOptions.svelte";
import Modal from "../widgets/Modal.svelte";
import { _ } from "svelte-i18n";

const cm = new CaseManager();
const em = new EncounterManager();
const pm = new PatientManager();
let patients: Array<Tree<konsdef>> = [];

let tSelected: Array<Tree<konsdef>> = [];
let selectedElement: any;
const biller = new Billing();
let selector = false;
let deselector = false;
biller.getBillables().then((result) => {
  patients = result.getChildren();
});
function toggle(t: Tree<konsdef>) {
  t.props.open = !t.props.open;
  patients = patients;
}

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

async function detailDisplay(node) {
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
async function getPatient(t: Tree<konsdef>): Promise<Patient> {
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

function doSelect() {
  const temp = new Tree<konsdef>(null, null);
  if (selectOptions.bName) {
    const regexp = new RegExp(selectOptions.name + ".*", "i");
    for (const node of patients) {
      if (
        node.payload.lastname.match(regexp) ||
        node.payload.firstname.match(regexp)
      ) {
        // new Tree<konsdef>(temp, node.payload);
        temp.acquireTree(node);
      }
    }
  }
  tSelected = temp.getChildren();
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
  return bills;
}
</script>

<template>
  {#if selector}
    <Modal
      title="{$_('actions.select')}"
      dismiss="{(ok) => {
        selector = false;
        if (ok) {
          doSelect();
        }
      }}"
    >
      <div slot="body"><SelectOptions options="{selectOptions}" /></div>
    </Modal>
  {/if}
  {#if deselector}
    <Modal
      title="{$_('actions.deselect')}"
      dismiss="{(ok) => {
        deselector = false;
        if (ok) {
        }
      }}"
    >
      <div slot="body">deselect</div>
    </Modal>
  {/if}
  <div class="flex flex-row">
    <div class="border-2 border-solid border-blue-400 rounded m-2 flex-1">
      <h2 class="mx-3">
        {$_("titles.unbilled")}<span
          class="ml-4 text-sm cursor-pointer underline hover:text-blue-600 rounded-full"
          on:click="{() => {
            selector = true;
          }}">{$_("actions.select")}</span
        >
      </h2>
      <TreeView
        trees="{patients}"
        labelProvider="{labelProvider}"
        on:selected="{(event) => detailDisplay(event.detail)}"
      />
      <!-- ul class="max-h-[80vh] overflow-auto">
        {#each patients as p}
          <li on:click="{() => toggle(p)}" class="cursor-pointer">
            {p.payload.lastname}
            {p.payload.firstname}
            {#if p.props.open}
              <ul>
                {#each p.getChildren() as f, k}
                  <li on:click|stopPropagation="{() => toggle(f)}">
                    {#await getFall(f)}
                      {$_("general.loading")}
                    {:then}
                      {cm.getLabel(f.payload.Fall)}
                    {/await}
                    {#if f.props.open}
                      <ul>
                        {#each f.getChildren() as e}
                          <li>
                            {#await getEncounter(e)}
                              {$_("general.loading")}
                            {:then enc}
                              {#await enc.getLabel()}
                                {$_("general.loading")}
                              {:then label}
                                {label}
                              {/await}
                            {/await}
                          </li>
                        {/each}
                      </ul>
                    {/if}
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul -->
    </div>

    <div class="border-2 border-solid border-blue-400 rounded m-2 flex-1">
      <h2 class="mx-3">
        {$_("titles.selected")}<span
          class="ml-4 text-sm cursor-pointer underline hover:text-blue-600"
          on:click="{() => {
            deselector = true;
          }}">{$_("actions.deselect")}</span
        >
      </h2>

      <TreeView
        trees="{tSelected}"
        labelProvider="{labelProvider}"
        on:selected="{(event) => detailDisplay(event.detail)}"
      />
      <button
        class="bg-blue-500 font-bolder text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 rounded-full"
        on:click="{createBills}"
      >
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
