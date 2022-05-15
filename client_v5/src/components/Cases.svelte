<script lang="ts">
import type { PatientType } from "../models/patient-model";
import { CaseManager } from "../models/case-model";
const cm = new CaseManager();
export let entity: PatientType;
let caselabels = ["--- Lade Fälle --- "];
cm.loadCasesFor(entity.id).then((cases) => {
  const cl = [];
  for (const fall of cases) {
    cl.push(cm.getLabel(fall));
  }
  caselabels = cl;
});
</script>

<template>
  <select class="w-max">
    {#each caselabels as fall}
      <option>{fall}</option>
    {/each}
  </select>
</template>
