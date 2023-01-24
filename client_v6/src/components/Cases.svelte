<script lang="ts">
  import type { PatientType } from "../models/patient-model";
  import type { CaseType } from "../models/case-model";
  import { CaseManager } from "../models/case-model";
  import CaseActions from "./CaseActions.svelte";
  import { currentPatient, currentCase } from "../services/store";
  import Dropdown from "../widgets/Dropdown.svelte";
  import CaseDetail from "./CaseDetail.svelte";
  import { _ } from "svelte-i18n";
  const cm = new CaseManager();
  let caselist: Array<CaseType> = [];
  let caselabels = ["--- Lade Fälle --- "];
  let selected = "";

  cm.loadCasesFor($currentPatient?.id).then((cases) => {
    const cl = [];
    cases.sort((a, b) => {
      if ($currentCase && $currentCase.id === a.id) {
        return -1;
      }
      if (!a.datumbis) {
        if (!b.datumbis) {
          return a.bezeichnung.localeCompare(b.bezeichnung);
        }
        return -1;
      } else if (!b.datumbis) {
        return 1;
      } else {
        return a.bezeichnung.localeCompare(b.bezeichnung);
      }
    });
    caselist = cases;
    for (const fall of cases) {
      cl.push(cm.getLabel(fall));
    }
    caselabels = cl;
    selected = caselabels[0];
    $currentCase = caselist[0];
  });
  function select(event) {
    const idx = caselabels.findIndex((el) => el === event.detail);
    if (idx !== -1) {
      $currentCase = caselist[idx];
      console.log("selected " + event.detail);
    }
  }
</script>

<template>
  {#if $currentPatient}
    <Dropdown elements={caselabels} {selected} on:changed={select} />
    <CaseDetail />
    <CaseActions />
  {:else}
    <p>{$_("validation.nopatient")}</p>
  {/if}
</template>
