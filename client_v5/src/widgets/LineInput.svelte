<script lang="ts">
export let value: string = "";
export let label: string = "";
export let disabled: boolean = false;
export let id: string = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, "")
  .substring(0, 5);

function changed() {}
</script>

<template>
  <div class="formfield flex flex-col">
    {#if label}
      <label for="{id}" class="text-sm font-bold text-gray-700">{label}</label>
    {/if}
    <input
      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      bind:value
      on:change="{changed}"
      id="{id}"
      disabled="{disabled}" />
  </div>
</template>
