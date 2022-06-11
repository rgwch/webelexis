<script lang="ts">
import type { BriefType } from "../models/briefe-model";
import { briefManager } from "../models";

import { currentPatient } from "../services/store";
let docs: Array<BriefType> = [];

currentPatient.subscribe((np) => {
  fetchDocuments()
});

async function fetchDocuments() {
  const result = await briefManager.find({
    query: { patientid: $currentPatient?.id, $sort:{datum: "desc"} },
  });
  docs = result.data as Array<BriefType>;
}
</script>

<template>
  <div class="scrollpanel">
    {#each docs as doc}
      <p class="py-0 my-0">{doc.datum} - {doc.betreff} - {doc.id} - {doc.path}</p>
    {/each}
  </div>
</template>
