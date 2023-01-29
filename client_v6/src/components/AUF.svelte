<script lang="ts">
  import type { AUFType } from "src/models/auf-model";
  import { currentPatient } from "../services/store";
  import { aufManager } from "../models";
  let aufList: Array<AUFType> = [];

  aufManager.fetchForPatient($currentPatient.id).then((result) => {
    if (result.total && result.data) {
      aufList = (result.data as Array<AUFType>).sort((a, b) => {
        if (!a.datumauz) {
          return 1;
        }
        if (!b.datumauz) {
          return -1;
        }
        return b.datumauz.localeCompare(a.datumauz);
      });
    }
  });
</script>

<template>
  {#if $currentPatient}
    <ul>
      {#each aufList as auf}
        <li>{aufManager.getLabel(auf)}</li>
      {/each}
    </ul>
  {/if}
</template>
