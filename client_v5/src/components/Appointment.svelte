<script lang="ts">
import { TerminModel, Statics } from "../models/termine-model";
import { createEventDispatcher } from "svelte";
import Collapse from "../widgets/Collapse.svelte";
import { terminManager } from "../models";
import { _ } from "svelte-i18n";
const dispatch = createEventDispatcher();
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
      <div class="flex">
        <div class="flex flex-col">
          <button
            on:click="{() => dispatch('shrink', termin)}"
            class="uibutton"
            >{$_("actions.shrink")}</button>
          <button
            on:click="{() => {
              dispatch('extend', termin);
            }}"
            class="uibutton"
            >{$_("actions.extend")}</button>
          <button
            on:click="{() => {
              dispatch('delete', termin);
            }}"
            class="uibutton"
            >{$_("actions.delete")}</button>
        </div>
        <div class="flex-grow px-2">
          <textarea
            class="w-full h-full"
            bind:value="{termin.obj.grund}"
            on:blur="{() => {
              terminManager.save(termin);
            }}"></textarea>
        </div>
        <div class="flex flex-col">
          <select
            bind:value="{termin.obj.termintyp}"
            class="uibutton">
            {#each Statics.terminTypes as type}
              <option value="{type}">{type}</option>
            {/each}
          </select>
          <select
            bind:value="{termin.obj.terminstatus}"
            class="uibutton">
            {#each Statics.terminStates as state}
              <option value="{state}">{state}</option>
            {/each}
          </select>
          <select
            bind:value="{termin.obj.bereich}"
            class="uibutton">
            {#each Statics.agendaResources as res}
              <option value="{res}">{res}</option>
            {/each}
          </select>
        </div>
     
      </div>
    </div>
  </Collapse>
</template>
<style>
  .uibutton{
    @apply "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md";
  }

</style>
