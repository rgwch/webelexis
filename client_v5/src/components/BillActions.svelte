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
  <div class="flex justify-left py-8">
    <button
      class="bg-blue-500 font-bolder text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-blue-600 mr-6"
    >
      {$_("billing.actions.output")}
    </button>
    <button
      class="bg-blue-500 font-bolder text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-blue-600 mr-6"
    >
      {$_("billing.actions.print")}
    </button>
    <button
      class="bg-blue-500 font-bolder text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-blue-600 mr-6"
    >
      {$_("billing.actions.demand_level")} &uarr;
    </button>
    <button
      class="bg-blue-500 font-bolder text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-blue-600 mr-6"
    >
      {$_("billing.actions.storno")}
    </button>
  </div>
</template>
