<script lang="ts">
import Finding from "./Finding.svelte";
import { currentPatient } from "../services/store";
import { findingsManager } from "../models";
import type { FindingType } from "../models/findings-model";

let findings: Array<FindingType> = [];

currentPatient.subscribe(async (p) => {
  await fetchFindings();
});

async function fetchFindings() {
  const ff = [];
  for (const names of findingsManager.getFindingNames()) {
    const fm: FindingType = await findingsManager.getFinding(
      names[0],
      $currentPatient.id,
      true
    );
    ff.push(fm);
  }
  findings = ff;
}
fetchFindings().then(() => {
  console.log("fetched " + findings.length + " findings");
});
</script>

<template>
  <div class="flex flex-wrap">
    {#each findings as finding}
      <div class="px-3 mx-3">
        <Finding bind:finding />
      </div>
    {/each}
  </div>
</template>
