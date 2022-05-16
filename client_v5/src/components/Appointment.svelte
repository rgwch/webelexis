<script lang="ts">
import type { TerminModel, TerminType } from "../models/termine-model";
import Collapse from "../widgets/Collapse.svelte";
import { _ } from "svelte-i18n";
import properties from "../services/properties";
export let termin: TerminModel;
function getTimes() {
  /*
  const dt = termin.getStartTime();
  const et = termin.getEndTime();
  return dt.toFormat("HH:mm") + "-" + et.toFormat("HH:mm");
  */
 return termin.getTimeString()
}
</script>

<template>
  <Collapse>
    <div slot="header">
      <span style="background-color:{termin.getStateColor()}">
        <span>{getTimes()}</span>
        {#await termin.getLabel()}
          {$_("general.loading")}
        {:then label}
          {label}
        {/await}
      </span>
    </div>
    <div slot="body">
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
