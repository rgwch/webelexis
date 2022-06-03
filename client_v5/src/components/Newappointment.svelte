<script lang="ts">
import { TerminModel } from "../models/termine-model";
import Collapse from "../widgets/Collapse.svelte";
import { _ } from "svelte-i18n";
import Slider from "@bulatdashiev/svelte-slider";
import PatientSelector from "./PatientSelector.svelte";
import { currentPatient } from "../services/store";
import { Patient } from "../models/patient-model";
import { Statics } from "../models/termine-model";
import { terminManager } from "../models";
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();

export let termin: TerminModel;
let value = [0, 0];
let expanded = false;
$: timelabel = TerminModel.makeTime(value[0]);
let selector = false;
let termintyp = Statics.terminTypes[2];
let terminstate = Statics.terminStates[1];
let duration = 30;
let reason = "";
async function accept() {
  termin.setBeginMinutes(value[0]);
  termin.setTyp(termintyp);
  termin.setStatus(terminstate);
  termin.setPatient($currentPatient);
  termin.setDuration(duration);
  termin.setDescription(reason);
  await terminManager.save(termin);
  expanded = false;
  dispatch("reload", termin.getDate());
}
</script>

<template>
  <Collapse bind:open="{expanded}">
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
      <div class="panel">
        <h3>{$_("appointment.enternew")}</h3>
        <div class="flex flex-columns">
          <span>{$_("appointment.time")}:</span>
          <span>{timelabel}</span>
          <span>{$_("appointment.duration")}</span>
          <span><input type="number" bind:value="{duration}" /></span>
          <Slider
            class="w-max inline-block"
            bind:value
            min="{termin.getBeginMinutes()}"
            max="{termin.getEndMinutes() - 5}"
            step="{5}" />
        </div>
        <p
          class="font-bold text-blue-700 cursor-pointer"
          on:click="{() => (selector = !selector)}">
          {@html Patient.getLabel($currentPatient)}
        </p>
        {#if selector}
          <PatientSelector on:selected="{() => (selector = false)}" />
        {/if}
        <div class="flex flex-row">
          <div class="flex flex-col">
            <select bind:value="{termintyp}">
              {#each Statics.terminTypes as type}
                <option value="{type}">{type}</option>
              {/each}
            </select>
            <select bind:value="{terminstate}">
              {#each Statics.terminStates as state}
                <option value="{state}">{state}</option>
              {/each}
            </select>
            <select bind:value="{termin.obj.bereich}">
              {#each Statics.agendaResources as res}
                <option value="{res}">{res}</option>
              {/each}
            </select>
          </div>
          <textarea class="w-max h-max" bind:value="{reason}"></textarea>
        </div>
        <button on:click="{accept}">{$_("appointment.enter")}</button>
      </div>
    </div>
  </Collapse>
</template>
