<script lang="ts">
  import type { CaseType } from "../models/case-model";
  import { _ } from "svelte-i18n";


  export let current:CaseType=undefined
</script>

<template>
  <div class="flex justify-left py-8">
    <button class="roundbutton">{$_("case.createEncounter")}</button>
    <button class="roundbutton">{$_("case.createNew")}</button>
    <button class="roundbutton">{$_("actions.close")}</button>
    <button class="roundbutton">{$_("actions.delete")}</button>
  </div>
  
</template>