<script lang="ts">
import { TerminModel } from "../models/termine-model";
import Collapse from "../widgets/Collapse.svelte";
import { _ } from "svelte-i18n";
import Slider from '@bulatdashiev/svelte-slider';


export let termin: TerminModel;
let value=[0,0]
$: timelabel=TerminModel.makeTime(value[0])
</script>

<template>
  <Collapse>
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
    <div slot="body">
      {timelabel}
      <Slider class="w-max" bind:value min={termin.getBeginMinutes()} max={termin.getEndMinutes()-5} step={5}></Slider>
    </div>
  </Collapse>
</template>