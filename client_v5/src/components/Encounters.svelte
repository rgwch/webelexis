<script lang="ts">
import EncounterDetail from "./EncounterDetail.svelte";
import { EncounterManager } from "../models/encounter-model";
import type { EncounterType } from "../models/encounter-model";
import type { PatientType } from "../models/patient-model";
const em = new EncounterManager();
export let entity:PatientType

let encounters: Array<EncounterType> = [];
em.fetchForPatient(entity?.id).then((result) => {
  encounters = result.data;
});
</script>

<template>
  <div class="h-screen">
    {#each encounters as encounter}
      <EncounterDetail entity="{encounter}" />
    {/each}
  </div>
</template>
