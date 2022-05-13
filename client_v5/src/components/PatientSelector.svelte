<script lang="ts">
import { PatientManager, Patient } from "../models/patient-model";
import type { PatientType } from "../models/patient-model";
import Fa from "svelte-fa";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { _ } from "svelte-i18n";
import {currentPatient} from '../main'

const pm = new PatientManager();
let found: Array<PatientType> = [];
let searchTerm = "";
async function doSearch() {
  const result = await pm.find({ query: { $find: searchTerm } });
  found = result.data;
}
</script>

<template>
  <div>
    <label for="params" class="block text-sm font-medium text-gray-700"
      >{$_("prompts.patsearch")}</label>
    <div class="mt-1 flex rounded-md shadow-sm">
      <div class="relative flex items-stretch flex-grow focus-within:z-10">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <!-- Heroicon name: solid/users -->
          <svg
            class="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true">
            <path
              d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          bind:value="{searchTerm}"
          name="params"
          id="params"
          class="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300" />
      </div>
      <button
        type="button"
        on:click="{doSearch}"
        class="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
        <!-- Heroicon name: solid/sort-ascending -->
        <Fa icon="{faMagnifyingGlass}" />
        <span>Los</span>
      </button>
    </div>
  </div>
  <div class="border-1 overflow-auto h-20">
    {#each found as entry}
      <p class="my-0 cursor-pointer hover:text-blue-400" on:click="{()=>{currentPatient.set(entry)}}">{@html Patient.getLabel(entry)}</p>
    {/each}
  </div>
</template>
