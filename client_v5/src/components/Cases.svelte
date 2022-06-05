<script lang="ts">
import type { PatientType } from "../models/patient-model";
import { CaseManager, type CaseType } from "../models/case-model";
import Dropdown from "../widgets/Dropdown.svelte";
import CaseDetail from "./CaseDetail.svelte";
const cm = new CaseManager();
export let entity: PatientType;
let caselist:Array<CaseType>=[]
let current
let caselabels = ["--- Lade Fälle --- "];
let selected=""
cm.loadCasesFor(entity.id).then((cases) => {
  const cl = [];
  caselist=cases
  for (const fall of cases) {
    cl.push(cm.getLabel(fall));
  }
  caselabels = cl;
  selected=caselabels[0]
  current=caselist[0]
});
function select(event){
  const idx=caselabels.findIndex((el)=>el===event.detail)
  if(idx!==-1){
    current=caselist[idx]
    console.log("selected "+event.detail)
  }
}
</script>

<template>
  <Dropdown
    elements="{caselabels}"
    selected="{selected}"
    on:changed="{select}" />
  <CaseDetail entity="{current}" />
</template>
