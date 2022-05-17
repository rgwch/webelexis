<script lang="ts">
import type { TerminModel, TerminType } from "../models/termine-model";
import Collapse from "../widgets/Collapse.svelte";
import { _ } from "svelte-i18n";
export let termin: TerminModel;
</script>

<template>
  <Collapse locked="{!termin.isAppointment()}">
    <div slot="header">
      <span style="background-color:{termin.getStateColor()}">
        <span>{termin.getTimeString()}</span>
        {#await termin.getLabel()}
          {$_("general.loading")}
        {:then label}
          {label}
        {/await}
      </span>
    </div>
    <div class="bg-blue-300 mx-4 px-2 border-1 rounded-md" slot="body">
      <p>{termin.getDescription()}</p>
    </div>
  </Collapse>
  <!-- div>
    {#if termin.isAppointment()}
      <span
        on:click="{() => {
          termin.props.open = !termin.props.open;
        }}">
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
  </div -->
</template>
