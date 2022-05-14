<script lang="ts">
import { PatientManager, Patient } from "../models/patient-model";
import type { PatientType } from "../models/patient-model";
import Fa from "svelte-fa";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { _ } from "svelte-i18n";
import { createEventDispatcher } from "svelte";
import { currentPatient } from "../main";
import LineInput from "../widgets/LineInput.svelte";
const dispatch = createEventDispatcher();

const pm = new PatientManager();
let found: Array<PatientType> = [];
let searchTerm = "";
async function doSearch() {
  const result = await pm.find({ query: { $find: searchTerm } });
  found = result.data;
}
function select(entry) {
  currentPatient.set(entry);
  dispatch("selected", entry);
}
</script>

<template>
  <div>
    <LineInput
      label="{$_('prompts.patsearch')}"
      bind:value="{searchTerm}"
      on:textChanged="{doSearch}"
      buttonIcon="{faMagnifyingGlass}" />
  </div>
  <div class="border-1 overflow-auto h-20">
    {#each found as entry}
      <p
        class="my-0 cursor-pointer hover:text-blue-400"
        on:click="{() => select(entry)}">
        {@html Patient.getLabel(entry)}
      </p>
    {/each}
  </div>
</template>
