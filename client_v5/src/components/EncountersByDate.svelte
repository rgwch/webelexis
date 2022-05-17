<script lang="ts">
import { encounterManager } from "../models";
import { EncounterModel, type EncounterType } from "../models/encounter-model";
import EncounterDetail from "./EncounterDetail.svelte";
import { _ } from "svelte-i18n";
import { Patient } from "../models/patient-model";
import Collapse from "../widgets/Collapse.svelte";
import DateInput from "../widgets/DateInput.svelte";
export let fromDate: string = "20220415"; // string = DateTime.now().toFormat("yyyyLLdd");
export let untilDate: string = "20220430"; // DateTime.now().toFormat("yyyyLLdd");
let list: Array<EncounterModel> = [];
let patients=new Set<string>()
let konsen=0
let searching=false

async function reload() {
  searching=true
  patients.clear()
  konsen=0
  const raw:Array<EncounterModel>=(await encounterManager.fetchForTimes(fromDate, untilDate, "")).map(k=>new EncounterModel(k))
  for(const k of raw){ 
    await k.getPatient()
    patients=patients.add(k.entity._Patient.id)
    konsen+=1    
  }  
  searching=false
  list=raw
}
</script>

<template>
  <div class="flex">
    <DateInput label="von" bind:dateString="{fromDate}" />
    <DateInput label="bis" bind:dateString="{untilDate}" />
    <button on:click="{reload}">Los</button>
  </div>
  <div>
    <span>{patients.size} Patienten, {konsen} Konsultationen</span>
  </div>
  {#if searching}
    <img src="webelexis-anim.gif" width="150px" alt="wait..." />
  {:else}
    {#each list as kons}
      <Collapse>
        <div slot="header">
          <span>{kons.getDateTime().toFormat($_("formatting.date"))}</span>
          <span>{@html Patient.getLabel(kons.entity._Patient)}</span>
        </div>
        <div slot="body">
          <EncounterDetail entity="{kons.entity}" />
        </div>
      </Collapse>
    {/each}
  {/if}
</template>
