<script lang="ts">
  import type { CaseType } from "../models/case-model";
  import { CaseManager } from "../models/case-model";
  import CaseActions from "./CaseActions.svelte";
  import { currentPatient, currentCase } from "../services/store";
  import Dropdown from "../widgets/Dropdown.svelte";
  import CaseDetail from "./CaseDetail.svelte";
  import { faLock } from "@fortawesome/free-solid-svg-icons";
  import { _ } from "svelte-i18n";
  const cm = new CaseManager();
  let caselist: Array<CaseType> = [];
  let caselabels = ["--- Lade Fälle --- "];
  let selected: CaseType = undefined;

  cm.loadCasesFor($currentPatient?.id).then((cases) => {
    caselist = cases;
    caselabels = cases.map((fall) => cm.getLabel(fall));
    selected = caselist[0];
    $currentCase = caselist[0];
  });
  function select(event) {
    $currentCase = event.detail;
    // console.log("selected " + event.detail);
  }
  function render(el: CaseType) {
    const lbl = cm.getLabel(el);
   
    if (cm.isClosed(el)) {
      return `<div class="flex flex-row"><img src="/lock-24.png" alt="locked" /><span class="text-gray-500">${lbl}</span></div>`;
    } else {
      return lbl;
    }
  }
</script>

<template>
  {#if $currentPatient}
    <Dropdown elements={caselist} {selected} {render} on:changed={select} />
    <CaseDetail />
    <CaseActions />
  {:else}
    <p>{$_("validation.nopatient")}</p>
  {/if}
</template>
