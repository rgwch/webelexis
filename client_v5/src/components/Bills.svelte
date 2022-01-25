<script lang="ts">
  import type { Invoice } from '../models/invoice'
  export let bills: Array<Invoice> = []
 
</script>

<template>
  <div class="overflow-auto">
    <ul>
      {#each bills as bill}
        <li>{bill.rnnummer} {bill.betrag} {bill.patient.bezeichnung1}</li>
      {/each}

    </ul>
  </div>
</template>
