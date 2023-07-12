<script lang="ts">
  export let options = ["a", "b", "c"];
  export let value;
</script>

<template>
  <div class="flex flex-row">
    {#each options as opt}
    <label for={opt} class="px-2">{opt}</label>
      <input type="radio" value={opt} bind:group={value} name="value"/>
    {/each}
  </div>
</template>
