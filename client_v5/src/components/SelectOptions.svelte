<script lang="ts">
  import type { BillingsFilter } from "../services/billing";

  export let options: BillingsFilter = {};
</script>

<template>
  <div>
    <input
      type="checkbox"
      bind:checked={options.bSelected}
      on:click={() => {
        options.bSelected = !options.bSelected;
      }}
    />
    <span>Markierte</span>
  </div>
  <div>
    <input type="checkbox" bind:checked={options.bFirstolder} />
    <span class="px-2">Erste Konsultation älter als</span><input
      type="text"
      size="4"
      bind:value={options.firstolderdays}
      class="border"
    /><span>Tage</span>
  </div>
  <div>
    <input type="checkbox" bind:checked={options.bLastolder} />
    <span class="px-2">Letzte Konsultation älter als</span><input
      type="text"
      size="4"
      bind:value={options.lastolderdays}
      class="border"
    /><span>Tage</span>
  </div>
  <div>
    <input type="checkbox" bind:checked={options.bBetween} />
    <span class="px-2">Konsultationen zwischen</span><input
      type="date"
      bind:value={options.betweenfrom}
      class="border"
    /><span>und </span>
    <input type="date" bind:value={options.betweenuntil} class="border" />
  </div>
  <div>
    <input type="checkbox" bind:checked={options.bAmount} />
    <span class="px-2">Betrag höher als </span>
    <input
      type="text"
      size="6"
      bind:value={options.amount}
      class="border"
      on:change={() => {
        options.bAmount = options.amount > 0;
      }}
    />
  </div>
  <div>
    <input type="checkbox" bind:checked={options.bName} />
    <span class="px-2">Name oder Vorname</span><input
      type="text"
      size="15"
      bind:value={options.name}
      class="border"
    />
  </div>
</template>
