<script lang="ts">
export let text: string = "";
export let type: "info" | "warn" = "info";
</script>

<template>
  {#if type == "info"}
    <span
      class="bg-blue-200 text-blue-800 px-2.5 py-0.5 text-xs font-medium border border-blue-400 rounded-md shadow shadow-gray-500"
      >{text}</span>
  {:else if type == "warn"}
    <span
      class="bg-red-400 text-black px-2.5 py-0.5 text-xs font-medium border border-red-200 shadow shadow-gray-500 rounded-md"
      >{text}</span>
  {/if}
</template>
