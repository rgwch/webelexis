<script lang="ts">
import { encounterManager } from "../models";
import { EncounterModel } from "../models/encounter-model";
import EncounterDetail from "./EncounterDetail.svelte";
import { DateTime } from "luxon";
import { Patient } from "../models/patient-model";
import Collapse from "../widgets/Collapse.svelte";
export let fromDate: string= "20220415" // string = DateTime.now().toFormat("yyyyLLdd");
export let untilDate: string = "20220430" // DateTime.now().toFormat("yyyyLLdd");
let list:Array<EncounterModel> = [];

function reload() {
  encounterManager.fetchForTimes(fromDate, untilDate, "").then((result) => {
    list = result.map((e) => new EncounterModel(e));
  });
}
reload()
</script>

<template>
  {#each list as kons}
    {#await kons.getPatient()}
      <div>...</div>
    {:then patient}
      <Collapse>
        <div slot="header">
          <span>{@html Patient.getLabel(patient)}</span>
        </div>
        <div slot="body">
          <EncounterDetail entity="{kons.entity}" />
        </div>
      </Collapse>
    {/await}
  {/each}
</template>
