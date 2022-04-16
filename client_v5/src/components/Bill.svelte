<script lang="ts">
  import { binding_callbacks } from "svelte/internal";

  import { Invoice } from "../models/invoice-model";
  import type { InvoiceType } from "../models/invoice-model";

  export let invoice: InvoiceType = undefined;
  const bill = new Invoice(invoice);
  const state: string = bill.getInvoiceState();
  let states: Array<string> = bill.getTrace(Invoice.STATECHANGE);
  let outputs: Array<string> = bill.getTrace(Invoice.OUTPUT);
</script>

<template>
  <p>state</p>
  {#each states as state}
    <p>{state}</p>
  {/each}
  <hr />
  {#each outputs as output}
    <p>{output}</p>
  {/each}
</template>
