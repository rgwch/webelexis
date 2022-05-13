<script lang="ts">
import InfiniteScroll from "svelte-infinite-scroll";
import EncounterDetail from "./EncounterDetail.svelte";
import { EncounterManager } from "../models/encounter-model";
import type { EncounterType } from "../models/encounter-model";
import type { PatientType } from "../models/patient-model";
import {currentPatient} from '../main'
const em = new EncounterManager();

let encounters: Array<EncounterType> = [];

em.fetchForPatient($currentPatient.id).then((result) => {
  encounters = result.data;
});
</script>

<template>
  {#each encounters as encounter}
    <EncounterDetail entity="{encounter}" />
  {/each}
</template>
