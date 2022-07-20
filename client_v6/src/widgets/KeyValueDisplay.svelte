<script lang="ts">
  import LineInput from "./LineInput.svelte";
  export let obj = {};
</script>

<template>
  <div class="scrollpanel">
    {#each Object.keys(obj) as key}
      {#if typeof obj[key] === "string"}
        <LineInput label={key} value={obj[key]} on:textChanged />
      {/if}
    {/each}
  </div>
</template>
