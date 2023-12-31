<script lang="ts">
  import { encounterManager } from "../models";
  import { EncounterModel } from "../models/encounter-model";
  import EncounterDetail from "./EncounterDetail.svelte";
  import { DateTime } from "luxon";
  import { _ } from "svelte-i18n";
  import { patientManager } from "../models/patient-model";
  import Collapse from "../widgets/Collapse.svelte";
  import DateInput from "../widgets/DateInput.svelte";
  import { Money } from "../models/money";
  import { each } from "svelte/internal";
  export let fromDate: string = DateTime.now().toFormat("yyyyLLdd");
  export let untilDate: string = DateTime.now().toFormat("yyyyLLdd");
  let list: Array<EncounterModel> = [];
  let patients = new Set<string>();
  let konsen = 0;
  let total: Money = new Money(0);
  let byLaw = new Map<string, { encounters: number; sum: Money }>();
  let lawnames=[]
  let searching = false;

  async function reload() {
    searching = true;
    patients.clear();
    konsen = 0;
    total = new Money(0);
    byLaw = new Map<string, { encounters: number; sum: Money }>();
  
    const raw: Array<EncounterModel> = (
      await encounterManager.fetchForTimes(fromDate, untilDate, "")
    ).map((k) => new EncounterModel(k));
    for (const k of raw) {
      await k.getPatient();
      const fall = await k.getCase();
      const law = fall.gesetz;
      const sum = await k.getSum();
      total = total.add(sum);
      patients = patients.add(k.entity._Patient.id);
      konsen += 1;
      let entry;
      if (byLaw.has(law)) {
        entry = byLaw.get(law);
        entry.encounters += 1;
        entry.sum = entry.sum.add(sum);
      } else {
        entry = { encounters: 1, sum };
      }
      byLaw.set(law, entry);
    }
    searching = false;
    list = raw;
    lawnames=[...byLaw.keys()]
  }
  // bg-blue-500 font-bolder text-white px-3 py-2 mx-4 mt-4 transition duration-300 ease-in-out hover:bg-blue-600 rounded-full
</script>

<template>
  <div class="flex">
    <DateInput label="von" bind:dateString={fromDate} />
    <DateInput label="bis" bind:dateString={untilDate} />

    <button class="roundbutton mx-4 mt-4" on:click={reload}>
      {$_("actions.go")}
    </button>
  </div>
  <div>
    <span
      >{patients.size} Patienten, {konsen} Konsultationen, Total CHF {total.getFormatted()}</span
    >
    {#each lawnames as lawname}
      <p class="ml-4">{lawname}: {byLaw.get(lawname).encounters} Konsultationen, Total CHF {byLaw.get(lawname).sum.getFormatted()}</p>
    {/each}
  </div>
  {#if searching}
    <img src="webelexis-anim.gif" width="150px" alt="wait..." />
  {:else}
    <div class="scrollpanel">
      {#each list as kons}
        <Collapse>
          <div slot="header">
            <span class="hover:text-blue-700"
              >{kons.getDateTime().toFormat($_("formatting.date"))}</span
            >
            <span class="hover:(text-blue-700 font-bold)"
              >{@html patientManager.getLabel(kons.entity._Patient)}</span
            >
            <span> - {kons.entity._Sum.getFormatted()} </span>
          </div>
          <div slot="body">
            <EncounterDetail entity={kons.entity} />
          </div>
        </Collapse>
      {/each}
    </div>
  {/if}
</template>
