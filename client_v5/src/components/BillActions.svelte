<script lang="ts">
  import type { InvoiceType } from "../models/invoice-model";
  import { _ } from "svelte-i18n";
  export let selection: Array<InvoiceType> = [];
  function output(onprinter: boolean) {
    let out: string = "";
    for (const bill of selection) {
      if (bill) {
        out += bill.rnnummer + " ";
      }
    }
    alert(out);
  }
</script>

<template>
  <button type="button" on:click={() => output(false)}
    >{$_("billing.actions.output")}</button
  >
</template>
