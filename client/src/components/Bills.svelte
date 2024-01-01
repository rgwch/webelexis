<script lang="ts">
  import { InvoiceState } from "../models/invoice-model";
  import type { InvoiceType } from "../models/invoice-model";
  import { Money } from "../models/money";
  import { DateTime } from "luxon";
  import { _ } from "svelte-i18n";
  import BillActions from "./BillActions.svelte";
  import Bill from "./Bill.svelte";
  import Modal from "../widgets/Modal.svelte";

  export let bills: Array<InvoiceType>;
  export let busy = false;

  export let filter: (arg: any) => boolean = (bill?) => {
    return true;
  };
  let allchecked: boolean = false;
  let reverse: boolean = true;
  // let selection: Array<InvoiceType> = [];
  // let checked: Array<boolean> = [];
  let current: InvoiceType = undefined;

  function checkall() {
    const prev = bills[0].selected;
    for (let i = 0; i < bills.length; i++) {
      bills[i].selected = !prev;
    }
    allchecked = false;
  }
  function select(i: number) {
    bills[i].selected = !bills[i].selected;
  }

  function sort(col: string) {
    // console.log("sort " + col);
    reverse = !reverse;
    bills = bills.sort((a, b) => {
      let result = 0;
      if (col === "betrag") {
        result = parseFloat(a[col]) - parseFloat(b[col]);
      } else if (col === "caselaw") {
        result = a._Fall.gesetz.localeCompare(b._Fall.gesetz);
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
        <th class="tableheader" on:click={() => sort("rnnummer")}
          >{$_("billing.invoicenumber")}</th
        >

        <th class="tableheader" on:click={() => sort("rndatum")}
          >{$_("billing.invoicedate")}
        </th>
        <th class="tableheader" on:click={() => sort("caselaw")}>
          {$_("billing.law")}
        </th>
        <th class="tableheader" on:click={() => sort("rnstatus")}
          >{$_("billing.invoicestate")}
        </th>
        <th class="tableheader" on:click={() => sort("statusdatum")}
          >{$_("billing.statedate")}</th
        >
        <th
          class="tableheader"
          on:click={() => {
            sort("betrag");
          }}>{$_("billing.amount")}</th
        >
        <th
          class="hover:text-blue-600 underline cursor-pointer"
          on:click={() => sort("_Patname")}>{$_("patient.patient")}</th
        >
      </thead>
      <tbody>
        {#if busy}
          <img src="webelexis-anim.gif" width="150px" alt="wait..." />
        {:else}
          {#each bills.filter(filter) as bill, idx}
            <tr>
              <td>
                <input
                  type="checkbox"
                  bind:checked={bills[idx].selected}
                  on:click={() => select(idx)}
                />
              </td>
              <td
                class="text-center cursor-pointer underline hover:text-blue-600"
                on:click={() => (current = bill)}>{bill.rnnummer}</td
              >
              <td class="text-center"
                >{DateTime.fromISO(bill.rndatum).toFormat(
                  $_("formatting.date")
                )}</td
              >
              <td class="text-center">
                {bill._Fall.gesetz}
              </td>
              <td class="text-center"
                >{$_("billing." + InvoiceState[bill.rnstatus])}</td
              >
              <td class="text-center"
                >{DateTime.fromISO(bill.statusdatum).toFormat(
                  $_("formatting.date")
                )}</td
              >
              <td class="text-right">{new Money(bill.betrag).getFormatted()}</td
              >
              <td class="text-left px-8">
                {bill._Patname}
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
  {#if current}
    <Modal
      title={current._Patname + ", " + current.rnnummer}
      dismiss={() => {
        current = undefined;
      }}
    >
      <div slot="body">
        <Bill invoice={current} />
      </div>
    </Modal>
  {/if}
  <BillActions bind:selection={bills} on:success on:failure />
</template>

<style>
  .tableheader {
    @apply "mx-1 cursor-pointer hover:(text-blue-600 underline) ";
  }
</style>
