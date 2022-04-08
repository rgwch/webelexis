<script lang="ts">
  import type { InvoiceType } from "../models/invoice-model";
  import { InvoiceState, Invoice } from "../models/invoice-model";
  import { _ } from "svelte-i18n";
  export let selection: Array<InvoiceType> = [];
  async function output(withPrint: boolean) {
    for (let i = 0; i < selection.length; i++) {
      if (selection[i].selected) {
        const bill = new Invoice(selection[i]);
        const result = await bill.print(withPrint);
        selection[i].selected = false;
      }
    }
    alert("ok");
  }
</script>

<template>
  <button type="button" on:click={() => output(false)}
    >{$_("billing.actions.output")}</button
  >
</template>
