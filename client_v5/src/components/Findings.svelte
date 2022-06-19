<script lang="ts">
import Finding from "./Finding.svelte";
import Collapse from "../widgets/Collapse.svelte";

import Popup from "../widgets/Popup.svelte";
import { currentPatient } from "../services/store";
import { findingsManager } from "../models";
import type { FindingType } from "../models/findings-model";
import type { FindingsModel } from "../models/findings-model";

let findings: Array<FindingsModel> = [];

currentPatient.subscribe(async (p) => {
  await fetchFindings();
  console.log("fetched " + findings.length + " findings");
});

async function fetchFindings() {
  const ff = [];
  for (const names of findingsManager.getFindingNames()) {
    const fm: FindingsModel = await findingsManager.getFinding(
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
        <Finding finding="{finding}" />
      </div>
    {/each}
  </div>
</template>
