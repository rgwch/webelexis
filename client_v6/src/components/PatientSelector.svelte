<script lang="ts">
  import { patientManager as pm, type PatientType} from "../models/patient-model";
  import {encounterManager} from '../models'
  import Fa from "svelte-fa";
  import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
  import { _ } from "svelte-i18n";
  import { createEventDispatcher } from "svelte";
  import { currentPatient,currentEncounter, currentCase } from "../services/store";
  import LineInput from "../widgets/LineInput.svelte";
  const dispatch = createEventDispatcher();

  let found: Array<PatientType> = [];
  let searchTerm = "";
  async function doSearch() {
    const result = await pm.find({ query: { $find: searchTerm } });
    found = result.data;
  }
  async function select(entry:PatientType) {
    currentPatient.set(entry);
    let enc;
    if(entry.extjson?.LetzteBehandlung){
      enc=encounterManager.fetch(entry.extjson.LetzteBehandlung)
    }else{
      const encs:query_result=await encounterManager.fetchForPatient(entry.id)
      if(encs.total>0){
        enc=encs.data[0]
      }
    }
    if(enc){
      currentEncounter.set(enc)
      currentCase.set(await encounterManager.getCase(enc))
    }
    dispatch("selected", entry);
  }
</script>

<template>
  <div>
    <LineInput
      label={$_("prompts.patsearch")}
      bind:value={searchTerm}
      on:textChanged={doSearch}
      buttonIcon={faMagnifyingGlass}
    />
  </div>
  {#if found.length > 0}
    <div class="border-1 overflow-auto h-80">
      {#each found as entry}
        <p
          class="my-0 cursor-pointer hover:text-blue-400"
          on:click={() => select(entry)}
        >
          {#await pm.getDecoratedLabel(entry)}
            {@html pm.getLabel(entry)}
          {:then patlabel}
            {@html patlabel}
          {/await}
        </p>
      {/each}
    </div>
  {/if}
</template>
