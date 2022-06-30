<script lang="ts">
import { getService } from "../services/io";
import { labresultManager } from "../models";
import { currentPatient } from "../services/store";
import { each } from "svelte/internal";
import type { LABRESULTS } from "../models/labresult-model";
import Collapse from "../widgets/Collapse.svelte";
let labresults: LABRESULTS = { dates: [], items: {} };
labresultManager.fetchForPatient($currentPatient?.id).then((result) => {
  labresults = result;
});
</script>

<template>
  {#each Object.keys(labresults.items) as group}
    <Collapse title="{group}">
      <div slot="body">
        {#each Object.keys(labresults.items[group]) as item}
          <p class="text-blue-600">{item}</p>
        {/each}
      </div>
    </Collapse>
  {/each}
</template>
