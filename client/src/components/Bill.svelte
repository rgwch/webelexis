<script lang="ts">
import { Invoice } from "../models/invoice-model";
import type { InvoiceType } from "../models/invoice-model";
import { _ } from "svelte-i18n";

export let invoice: InvoiceType = undefined;
const bill = new Invoice(invoice);
let states: Array<string> = bill
  .getTrace(Invoice.TRACE_STATECHANGE)
  .map((e) => {
    const parts = e.split(/: /);
    const text = bill.getInvoiceState(parts[1]);
    return parts[0] + ": " + text;
  });
let outputs: Array<string> = bill.getTrace(Invoice.TRACE_OUTPUT);
</script>

<template>
  <div>
    <p class="m-0 p-0">
      {$_("billing.invoicestate")}: {bill.getInvoiceState()}
      <button>manuell ändern</button>
    </p>
    <p class="mb-0 font-bold">{$_("titles.progress")}:</p>
    <div class="overflow-auto h-20 border border-2 border-blue-400 py-1">
      <ul class="list-none my-0">
        {#each states as state}
          <li class="text-sm py-0 my-0">{state}</li>
        {/each}
      </ul>
    </div>
    <p class="mb-0 font-bold">{$_("titles.outputs")}:</p>
    <div class="overflow-auto h-20 border-2 border-blue-400 py-1">
      <ul class="list-none py-0 my-0">
        {#each outputs as output}
          <li class="text-sm py-0 my-0">{output}</li>
        {/each}
      </ul>
    </div>
  </div>
</template>
