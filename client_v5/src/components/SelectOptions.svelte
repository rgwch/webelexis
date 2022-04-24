<script lang="ts">
  export let options = {
    selected: true,
    firstolder: false,
    lastolder: false,
    firstolderdays: 60,
    lastolderdays: 30,
  };
</script>

<template>
  <div>
    <input
      type="checkbox"
      bind:checked={options.selected}
      on:click={() => {
        options.selected = !options.selected;
      }}
    />
    <span>Markierte</span>
  </div>
  <div>
    <input type="checkbox" bind:checked={options.firstolder} />
    <span>Erste Konsultation älter als</span><input
      type="text"
      bind:value={options.firstolderdays}
    /><span>Tage</span>
  </div>
  <div>
    <input type="checkbox" bind:checked={options.lastolder} />
    <span>Letzte Konsultation älter als</span><input
      type="text"
      bind:value={options.lastolderdays}
    /><span>Tage</span>
  </div>
</template>
