<script lang="ts">
  import EncounterDetail from "./EncounterDetail.svelte";
  import { EncounterManager } from "../models/encounter-model";
  import type { EncounterType } from "../models/encounter-model";
  import type { PatientType } from "../models/patient-model";
  import InfiniteScroll from "svelte-infinite-scroll";
  import { currentPatient, currentCase } from "../services/store";
  import { onMount } from "svelte";
  const BATCHSIZE = 11;
  const em = new EncounterManager();
  let offset = 0;
  let newBatch = [];
  let encounters: Array<EncounterType> = [];

  currentPatient.subscribe((np) => {
    offset = 0;
    newBatch = [];
    encounters = [];
    fetchEncounters();
  });

  async function fetchEncounters() {
    const result = await em.fetchForPatient(
      $currentPatient?.id,
      offset,
      BATCHSIZE
    );
    newBatch = result.data.map((e) => {
      e._Patient = $currentPatient;
      return e;
    });
    offset = result.skip + result.data.length;
  }

  $: {
    encounters = [...encounters, ...newBatch];
    em.getCase(encounters[0]).then((c) => {
      currentCase.set(c);
    });
  }

  onMount(() => {
    offset = 0;
    fetchEncounters();
  });
</script>

<template>
  <div class="scrollpanel">
    {#each encounters as encounter}
      <EncounterDetail entity={encounter} />
    {/each}
    <InfiniteScroll
      hasMore={newBatch.length > 0}
      threshold={10}
      on:loadMore={() => fetchEncounters()}
    />
  </div>
</template>
