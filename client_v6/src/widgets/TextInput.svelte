<script lang="ts">
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();
export let value: string = "";
export let label: string = "";
export let readonly: boolean = false;
export let id: string = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, "")
  .substring(0, 5);
export let lines = 5;
</script>

<template>
  <div class="formfield flex flex-col">
    {#if label}
      <label for="{id}" class="block text-sm font-bold text-gray-700"
        >{label}</label>
    {/if}
    <div class="mt-1">
      <textarea
        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        id="{id}"
        rows="{lines}"
        bind:value
        readonly="{readonly}"
        style="width:100%;height:5em;"
        on:change="{() => dispatch('textChanged', value)}"></textarea>
    </div>
  </div>
</template>
