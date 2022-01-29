<script lang="ts">
  import { type Invoice, InvoiceState } from "../models/invoice";
  import { Money } from "../models/money";
  import { DateTime } from "luxon";
    import { _ } from "svelte-i18n";
  export let bills: Array<Invoice> = [];
</script>

<template>
  <div class="overflow-auto">
    <table>
      <thead>
        <th class="px-5 mx-5">{$_("billing.invoicenumber")}</th>
        <th>{$_("billing.invoicedate")} </th>
        <th>{$_("billing.invoicestate")} </th>
        <th>{$_("billing.statedate")}</th>
        <th>{$_("billing.amount")}</th>
        <th>{$_("billing.patient")}</th>
      </thead>
      <tbody>
        {#each bills as bill}
          <tr>
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
</template>
