<script lang="ts">
  import LineInput from "./LineInput.svelte";
  export let obj = {};
</script>

<template>
  {#each Object.keys(obj) as key}
    <LineInput label={key} value={obj[key]} />
  {/each}
</template>
