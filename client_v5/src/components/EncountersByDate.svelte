<script lang="ts">
import { encounterManager } from "../models";
import { EncounterModel, type EncounterType } from "../models/encounter-model";
import EncounterDetail from "./EncounterDetail.svelte";
import { _ } from "svelte-i18n";
import { Patient } from "../models/patient-model";
import Collapse from "../widgets/Collapse.svelte";
import DateInput from "../widgets/DateInput.svelte";
import { Money } from "../models/money";
export let fromDate: string = "20220429"; // string = DateTime.now().toFormat("yyyyLLdd");
export let untilDate: string = "20220430"; // DateTime.now().toFormat("yyyyLLdd");
let list: Array<EncounterModel> = [];
let patients=new Set<string>()
let konsen=0
let total:Money=new Money(0)
let searching=false

async function reload() {
  searching=true
  patients.clear()
  konsen=0
  total=new Money(0)
  const raw:Array<EncounterModel>=(await encounterManager.fetchForTimes(fromDate, untilDate, "")).map(k=>new EncounterModel(k))
  for(const k of raw){
    await k.getPatient()
    total=total.add(await k.getSum())
    patients=patients.add(k.entity._Patient.id)
    konsen+=1
  }
  searching=false
  list=raw
}
// bg-blue-500 font-bolder text-white px-3 py-2 mx-4 mt-4 transition duration-300 ease-in-out hover:bg-blue-600 rounded-full
</script>

<template>
  <div class="flex">
    <DateInput label="von" bind:dateString="{fromDate}" />
    <DateInput label="bis" bind:dateString="{untilDate}" />

    <button class="roundbutton mx-4 mt-4" on:click="{reload}">
      {$_("actions.go")}
    </button>
  </div>
  <div>
    <span
      >{patients.size} Patienten, {konsen} Konsultationen, Total CHF {total.getFormatted()}</span>
  </div>
  {#if searching}
    <img src="webelexis-anim.gif" width="150px" alt="wait..." />
  {:else}
    <div class="scrollpanel">
      {#each list as kons}
        <Collapse>
          <div slot="header">
            <span class="hover:text-blue-700"
              >{kons.getDateTime().toFormat($_("formatting.date"))}</span>
            <span class="hover:(text-blue-700 font-bold)"
              >{@html Patient.getLabel(kons.entity._Patient)}</span>
            <span> - {kons.entity._Sum.getFormatted()} </span>
          </div>
          <div slot="body">
            <EncounterDetail entity="{kons.entity}" />
          </div>
        </Collapse>
      {/each}
    </div>
  {/if}
</template>
