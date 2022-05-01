<script lang="ts">
import type { TerminModel, TerminType } from "../models/termine-model";
import { _ } from "svelte-i18n";
import Fa from "svelte-fa";
import {
  faCaretRight,
  faCaretDown,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import properties from "../services/properties";
export let termin: TerminModel;
</script>

<template>
  <div>
    {#if termin.isAppointment()}
      <span
        on:click="{() => {
          termin.props.open = !termin.props.open;
        }}"
      >
        <Fa icon="{faCaretRight}" class="mx-2" />
      </span>
    {/if}
    <span style="background-color:{termin.getStateColor()}">
      {#await termin.getLabel()}
        {$_("general.loading")}
      {:then label}
        {label}
      {/await}
    </span>
    {#if termin.props.open}
      <p>{termin.getDescription()}</p>
    {/if}
  </div>
</template>
