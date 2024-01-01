<script lang="ts">
import { TerminModel, Statics } from "../models/termine-model";
import { createEventDispatcher } from "svelte";
import Collapse from "../widgets/Collapse.svelte";
import Dropdown from "../widgets/Dropdown.svelte";
import { terminManager } from "../models";
import { _ } from "svelte-i18n";
const dispatch = createEventDispatcher();
export let termin: TerminModel;
function save() {
  terminManager.save(termin);
}
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
          <button on:click="{() => dispatch('shrink', termin)}" class="uibutton"
            >{$_("actions.shrink")}</button>
          <button
            on:click="{() => {
              dispatch('extend', termin);
            }}"
            class="uibutton">{$_("actions.extend")}</button>
          <button
            on:click="{() => {
              dispatch('delete', termin);
            }}"
            class="uibutton">{$_("actions.delete")}</button>
        </div>
        <div class="flex-grow px-2">
          <textarea
            class="w-full h-20"
            bind:value="{termin.obj.grund}"
            on:blur="{save}"></textarea>
           <span> 
          <button
            class="roundbutton"
            on:click="{() => {
              dispatch('pselect', termin);
            }}">{$_("actions.topatient")}</button>
            <span class="text-right text-sm float-right">({termin.obj.erstelltvon}, {termin.getCreationTime().toLocaleString()})</span>
           </span>
        </div>
        <div class="flex-grow max-w-1/4">
          <Dropdown
            bind:selected="{termin.obj.termintyp}"
            elements="{Statics.terminTypes}"
            on:changed="{save}" />
          <Dropdown
            bind:selected="{termin.obj.terminstatus}"
            elements="{Statics.terminStates}"
            on:changed="{save}" />
          <Dropdown
            bind:selected="{termin.obj.bereich}"
            elements="{Statics.agendaResources}"
            on:changed="{save}" />
        </div>
      </div>
    </div>
  </Collapse>
</template>

<style>
.uibutton {
  @apply "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md";
}
</style>
