<script lang="ts">
  import type { BillingsFilter } from "../services/billing";

  export let options: Partial<{
    selected: boolean;
    firstolder: boolean;
    lastolder: boolean;
    between: boolean;
    amount: boolean;
    name: boolean;
    firstolderdays: number;
    lastolderdays: number;
    betweenfrom: string;
    betweenuntil: string;
    nametext: string;
    amountsum: 0;
  }> = {};
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
    <span class="px-2">Erste Konsultation älter als</span><input
      type="text"
      size="4"
      bind:value={options.firstolderdays}
      class="border"
    /><span>Tage</span>
  </div>
  <div>
    <input type="checkbox" bind:checked={options.lastolder} />
    <span class="px-2">Letzte Konsultation älter als</span><input
      type="text"
      size="4"
      bind:value={options.lastolderdays}
      class="border"
    /><span>Tage</span>
  </div>
  <div>
    <input type="checkbox" bind:checked={options.between} />
    <span class="px-2">Konsultationen zwischen</span><input
      type="date"
      bind:value={options.betweenfrom}
      class="border"
    /><span>und </span>
    <input type="date" bind:value={options.betweenuntil} class="border" />
  </div>
  <div>
    <input type="checkbox" bind:checked={options.amount} />
    <span class="px-2">Betrag höher als </span>
    <input
      type="text"
      size="6"
      bind:value={options.amountsum}
      class="border"
      on:change={() => {
        options.amount = options.amountsum > 0;
      }}
    />
  </div>
  <div>
    <input type="checkbox" bind:checked={options.name} />
    <span class="px-2">Name oder Vorname</span><input
      type="text"
      size="15"
      bind:value={options.nametext}
      class="border"
    />
  </div>
</template>
