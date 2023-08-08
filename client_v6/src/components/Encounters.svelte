<script lang="ts">
  import EncounterDetail from "./EncounterDetail.svelte";
  import { EncounterManager } from "../models/encounter-model";
  import type { EncounterType } from "../models/encounter-model";
  import InfiniteScroll from "svelte-infinite-scroll";
  import {
    currentPatient,
    currentCase,
    currentEncounter,
  } from "../services/store";
  import { onMount } from "svelte";
  import BillingEditor from "./BillingEditor.svelte";
  const BATCHSIZE = 11;
  const em = new EncounterManager();
  let offset = 0;
  let newBatch = [];
  let encounters: Array<EncounterType> = [];
  let showBillings = true;

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
    if (encounters && encounters.length > 0) {
      em.getCase(encounters[0]).then((c) => {
        currentCase.set(c);
      });
    }
  }

  onMount(() => {
    offset = 0;
    fetchEncounters();
  });
</script>

<template>
  <div class="flex">
    {#if showBillings}
      <div class="basis-1/3 h-100vg">
        <BillingEditor />
      </div>
    {/if}
    <div class="flex-1">
      {#each encounters as encounter}
        <div
          on:click={() => {
            console.log("changed");
            currentEncounter.set(encounter);
          }}
        >
          <EncounterDetail
            entity={encounter}
            on:billings={() => {
              showBillings = !showBillings;
            }}
          />
        </div>
      {/each}
      <InfiniteScroll
        hasMore={newBatch.length > 0}
        threshold={10}
        on:loadMore={() => fetchEncounters()}
      />
    </div>
  </div>
</template>
