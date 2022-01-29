<script lang="ts">
  import type { Invoice } from "../models/invoice";
  import {Money} from '../models/money'
  export let bills: Array<Invoice> = [];
</script>

<template>
  <div class="overflow-auto">
    <ul>
      {#each bills as bill}
        <li>{bill.rnnummer} {new Money(bill.betrag).getFormatted()} {bill.fall.patient.bezeichnung1}</li>
      {/each}
    </ul>
  </div>
</template>
