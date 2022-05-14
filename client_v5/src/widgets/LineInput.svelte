<script lang="ts">
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();
export let value: string = "";
export let label: string = "";
export let disabled: boolean = false;
export let id: string = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, "")
  .substring(0, 5);
export let validate: (ins) => boolean = (ins) => true;
export let errmsg = "Error";

let error = false;
function changed() {
  if (validate) {
    error = !validate(value);
  }
  if (!error) {
    dispatch("textChanged", value);
  }
}
function key(event) {
  if (event.code === "Enter") {
    changed();
  }
}
</script>

<template>
  <div class="formfield flex flex-col">
    {#if label}
      <label for="{id}" class="text-sm font-bold text-gray-700">{label}</label>
    {/if}
    <input
      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-200"
      bind:value
      on:blur="{changed}"
      on:keypress="{key}"
      id="{id}"
      disabled="{disabled}" />
    {#if error}
      <span class="text-sm font-semibold text-red-500">{errmsg}</span>
    {/if}
  </div>
</template>
