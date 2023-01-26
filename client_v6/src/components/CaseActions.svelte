<script lang="ts">
  import type { CaseType } from "../models/case-model";
  import { caseManager as cm } from "../models";
  import { currentCase } from "../services/store";
  import util from "../services/util";
  import { _ } from "svelte-i18n";

  function createEncounter() {
    if ($currentCase) {
      cm.createEncounterFor($currentCase);
    }
  }
  function open_close() {
    if (cm.isClosed($currentCase)) {
      $currentCase.datumbis = undefined;
    } else {
      $currentCase.datumbis = util.DateToElexisDate(new Date());
    }
    cm.save($currentCase);
  }
</script>

<template>
  <div class="flex justify-left py-8">
    <button class="roundbutton" on:click={createEncounter}
      >{$_("case.createEncounter")}</button
    >
    <button class="roundbutton">{$_("case.createNew")}</button>
    <button class="roundbutton" on:click={open_close}
      >{cm.isClosed($currentCase)
        ? $_("actions.reopen")
        : $_("actions.close")}</button
    >
    <button class="roundbutton">{$_("actions.delete")}</button>
  </div>
</template>
