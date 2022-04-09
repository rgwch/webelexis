<script lang="ts">
  import type { InvoiceType } from "../models/invoice-model";
  import { InvoiceState, Invoice, RnState } from "../models/invoice-model";
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
  async function demandlevel(up: boolean) {
    for (const sel of selection) {
      if (sel.selected) {
        try {
          const bill = new Invoice(sel);
          let newstate;
          switch (sel.rnstatus) {
            case RnState.OPEN_AND_PRINTED:
              newstate = RnState.DEMAND_NOTE;
              break;
            case RnState.DEMAND_NOTE_PRINTED:
              newstate = RnState.DEMAND_NOTE_2;
              break;
            case RnState.DEMAND_NOTE_2_PRINTED:
              newstate = RnState.DEMAND_NOTE_3;
              break;
            default:
              newstate = sel.rnstatus;
              alert("State can't be changed automatically " + sel.rnnummer);
          }
          const res = await bill.setInvoiceState(newstate);
          alert("OK: "+JSON.stringify(res));
        } catch (err) {
          alert("Error: "+err);
        }
      }
    }
  }
</script>

<template>
  <div class="flex justify-left py-8">
    <button
      class="bg-blue-500 font-bolder text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-blue-600 mr-6"
      on:click={() => output(false)}
    >
      {$_("billing.actions.output")}
    </button>
    <button
      class="bg-blue-500 font-bolder text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-blue-600 mr-6"
      on:click={() => output(true)}
    >
      {$_("billing.actions.print")}
    </button>
    <button
      class="bg-blue-500 font-bolder text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-blue-600 mr-6"
      on:click={() => demandlevel(true)}
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
