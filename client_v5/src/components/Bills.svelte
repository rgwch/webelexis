<script lang="ts">
  import { InvoiceState, Invoice } from "../models/invoice-model";
  import type { InvoiceType } from "../models/invoice-model";
  import { Money } from "../models/money";
  import { DateTime } from "luxon";
  import { _ } from "svelte-i18n";
  export let bills: Array<InvoiceType> = [];
  export let filter: (any) => boolean = (bill?) => {
    return true;
  };
  let allchecked: boolean = false;
  let reverse: boolean = true;
  const selection = new Array<boolean>(bills.length);
  function checkall() {
    const prev = selection[0];
    for (let i = 0; i < bills.length; i++) {
      selection[i] = !prev;
    }
    allchecked = false;
  }
  async function output(withPrint: boolean) {
    for (let i = 0; i < bills.length; i++) {
      if (selection[i]) {
        const bill = new Invoice(bills[i]);
        const result = await bill.print(withPrint);
        selection[i] = false;
      }
    }
    alert("ok");
  }
  function sort(col) {
    // console.log("sort " + col);
    reverse = !reverse;
    bills = bills.sort((a, b) => {
      let result = 0;
      if (col == "betrag") {
        result = parseFloat(a[col]) - parseFloat(b[col]);
      } else {
        result = a[col].localeCompare(b[col]);
      }
      return reverse ? result * -1 : result;
    });
  }
</script>

<template>
  <div class="overflow-auto max-h-[80vh] max-w-full">
    <table>
      <thead>
        <th
          ><input
            type="checkbox"
            on:click={checkall}
            bind:checked={allchecked}
          /></th
        >
        <th class="px-5 mx-5" on:click={() => sort("rnnummer")}
          >{$_("billing.invoicenumber")}</th
        >
        <th
          ><span on:click={() => sort("rndatum")}
            >{$_("billing.invoicedate")}</span
          >
        </th>
        <th on:click={() => sort("rnstatus")}>{$_("billing.invoicestate")} </th>
        <th on:click={() => sort("statusdatum")}>{$_("billing.statedate")}</th>
        <th
          on:click={() => {
            sort("betrag");
          }}>{$_("billing.amount")}</th
        >
        <th on:click={() => sort("_Patname")}>{$_("billing.patient")}</th>
      </thead>
      <tbody>
        {#each bills.filter(filter) as bill, idx}
          <tr>
            <td>
              <input type="checkbox" bind:checked={selection[idx]} />
            </td>
            <td class="text-center">{bill.rnnummer}</td>
            <td class="text-center"
              >{DateTime.fromISO(bill.rndatum).toFormat(
                $_("formatting.date")
              )}</td
            >
            <td class="text-center"
              >{$_("billing." + InvoiceState[bill.rnstatus])}</td
            >
            <td class="text-center"
              >{DateTime.fromISO(bill.statusdatum).toFormat(
                $_("formatting.date")
              )}</td
            >
            <td class="text-right">{new Money(bill.betrag).getFormatted()}</td>
            <td class="text-left px-8">
              {bill._Patname}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div>
    <button on:click={() => output(false)}>Ausgeben</button>
    <button
      on:click={() => {
        output(true);
      }}>Drucken</button
    >
  </div>
</template>
