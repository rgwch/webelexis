<script lang="ts">
  import type { CaseType } from "../models/case-model";
  import { caseManager as cm } from "../models";
  import { _ } from "svelte-i18n";

  export let current: CaseType = undefined;

  function createEncounter() {
    if (current) {
      cm.createEncounterFor(current);
    }
  }
</script>

<template>
  <div class="flex justify-left py-8">
    <button class="roundbutton" on:click={createEncounter}
      >{$_("case.createEncounter")}</button
    >
    <button class="roundbutton">{$_("case.createNew")}</button>
    <button class="roundbutton">{$_("actions.close")}</button>
    <button class="roundbutton">{$_("actions.delete")}</button>
  </div>
</template>
