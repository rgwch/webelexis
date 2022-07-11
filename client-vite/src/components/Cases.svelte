<script lang="ts">
import type { PatientType } from "../models/patient-model";
import type { CaseType } from "../models/case-model";
import { CaseManager } from "../models/case-model";
import { currentPatient } from "../services/store";
import Dropdown from "../widgets/Dropdown.svelte";
import CaseDetail from "./CaseDetail.svelte";
import { _ } from "svelte-i18n";
const cm = new CaseManager();
let caselist: Array<CaseType> = [];
let current;
let caselabels = ["--- Lade Fälle --- "];
let selected = "";

cm.loadCasesFor($currentPatient?.id).then((cases) => {
  const cl = [];
  caselist = cases;
  for (const fall of cases) {
    cl.push(cm.getLabel(fall));
  }
  caselabels = cl;
  selected = caselabels[0];
  current = caselist[0];
});
function select(event) {
  const idx = caselabels.findIndex((el) => el === event.detail);
  if (idx !== -1) {
    current = caselist[idx];
    console.log("selected " + event.detail);
  }
}
</script>

<template>
  {#if $currentPatient}
    <Dropdown
      elements="{caselabels}"
      selected="{selected}"
      on:changed="{select}" />
    <CaseDetail entity="{current}" />
  {:else}
    <p>{$_("validation.nopatient")}</p>
  {/if}
</template>
