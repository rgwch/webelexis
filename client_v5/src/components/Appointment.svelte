<script lang="ts">
import { TerminModel, Statics } from "../models/termine-model";
import {createEventDispatcher} from 'svelte'
import Collapse from "../widgets/Collapse.svelte";
import { terminManager } from "../models";
import { _ } from "svelte-i18n";
const dispatch=createEventDispatcher()
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
          <button>Kürzen</button>
          <button on:click={()=>{dispatch("extend",termin)}}>Verlängern</button>
          <button>Löschen</button>
        </div>
        <div class="flex flex-col">
          <select bind:value="{termin.obj.termintyp}">
            {#each Statics.terminTypes as type}
              <option value="{type}">{type}</option>
            {/each}
          </select>
          <select bind:value="{termin.obj.terminstatus}">
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
        <div class="flex-grow px-2">
          <textarea
            class="w-full h-full"
            bind:value="{termin.obj.grund}"
            on:blur="{() => {
              terminManager.save(termin);
            }}"></textarea>
        </div>
      </div>
    </div>
  </Collapse>
</template>
