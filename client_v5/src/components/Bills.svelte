<script lang="ts">
  import { InvoiceState, print } from "../models/invoice-model";
  import type { Invoice } from "../models/invoice-model";
  import { Money } from "../models/money";
  import { DateTime } from "luxon";
  import { _ } from "svelte-i18n";
  export let bills: Array<Invoice> = [];
  export let filter: (any) => boolean = (bill?) => {
    return true;
  };
  let allchecked: boolean = false;
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
        const result = await print(bills[i], withPrint);
        selection[i]=false
      }
    }
    alert ("ok")
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
        <th class="px-5 mx-5">{$_("billing.invoicenumber")}</th>
        <th>{$_("billing.invoicedate")} </th>
        <th>{$_("billing.invoicestate")} </th>
        <th>{$_("billing.statedate")}</th>
        <th>{$_("billing.amount")}</th>
        <th>{$_("billing.patient")}</th>
      </thead>
      <tbody>
        {#each bills.filter(filter) as bill, idx}
          <tr>
            <td>
              <input type="checkbox" bind:checked={selection[idx]} />
            </td>
            <td class="text-center">{bill.rnnummer}</td>
            <td class="text-center"
              >{DateTime.fromISO(bill.rndatum).toLocaleString()}</td
            >
            <td class="text-center"
              >{$_("billing." + InvoiceState[bill.rnstatus])}</td
            >
            <td class="text-center"
              >{DateTime.fromISO(bill.statusdatum).toLocaleString()}</td
            >
            <td class="text-right">{new Money(bill.betrag).getFormatted()}</td>
            <td class="text-left px-8">
              {bill.fall.patient.bezeichnung1}
              {bill.fall.patient.bezeichnung2}, {DateTime.fromISO(
                bill.fall.patient.geburtsdatum
              ).toLocaleString()}
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
