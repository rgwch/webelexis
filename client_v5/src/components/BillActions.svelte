<script lang="ts">
import type { InvoiceType } from "../models/invoice-model";
import { Invoice, RnState } from "../models/invoice-model";
import { _ } from "svelte-i18n";
export let selection: Array<InvoiceType> = [];
async function output(withPrint: boolean) {
  let err: boolean = false;
  for (let i = 0; i < selection.length; i++) {
    if (selection[i].selected) {
      const bill = new Invoice(selection[i]);
      const result = await bill.print(withPrint);
      if (result) {
        selection[i].selected = false;
      } else {
        err = true;
      }
    }
  }
  if (err) {
    alert("Es gab Fehler");
  }
  // alert("ok");
}
async function demandlevel(up: boolean = true) {
  for (const sel of selection) {
    if (sel.selected) {
      try {
        const bill = new Invoice(sel);
        let newstate: string;
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
        // alert("OK: " + JSON.stringify(res));
      } catch (err) {
        alert("Error: " + err);
      }
    }
  }
}
</script>

<template>
  <div class="flex justify-left py-8">
    <button
      class="roundbutton"
      on:click="{() => output(false)}">
      {$_("billing.actions.output")}
    </button>
    <button
      class="roundbutton"
      on:click="{() => output(true)}">
      {$_("billing.actions.print")}
    </button>
    <button
      class="roundbutton"
      on:click="{() => demandlevel(true)}">
      {$_("billing.actions.demand_level")} &uarr;
    </button>
    <button
      class="roundbutton">
      {$_("billing.actions.storno")}
    </button>
  </div>
</template>
