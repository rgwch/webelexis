<script lang="ts">
import type { TerminModel, TerminType } from "../models/termine-model";
import { _ } from "svelte-i18n";
import Fa from "svelte-fa";
import {
  faCaretRight,
  faCaretDown,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
export let termin: TerminModel;
</script>

<template>
  <div style="background-color:{termin.getStateColor()}">
    {#await termin.getLabel()}
      {$_("general.loading")}
    {:then label}
      {label}
    {/await}
  </div>
</template>
