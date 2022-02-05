<script lang="ts">
  import Bills from "../components/Bills.svelte";
  import Unbilled from "../components/Unbilled.svelte";
  import { getService } from "../services/io";
  import { InvoiceState } from "../models/invoice-model";
  import { _ } from "svelte-i18n";

  let bills;
  let billstate = InvoiceState[4];
  let name: string;

  const billService = getService("bills");
  billService
    .find({ query: { $limit: 50, rnStatus: InvoiceState[billstate] } })
    .then((result: query_result) => {
      bills = result.data;
    });
  let states: Array<string> = [];

  // Build Array of possible Bill states
  for (let value in InvoiceState) {
    if (typeof InvoiceState[value] === "number") {
      states.push(value);
    }
  }
  function select() {
    billService
      .find({ query: { $limit: 50, rnstatus: InvoiceState[billstate] } })
      .then((result: query_result) => {
        bills = result.data;
      });
  }

  function patfilter(bill): boolean {
    if (!name) {
      return true;
    }
    return (
      bill.fall.patient.bezeichnung1.match(name) ||
      bill.fall.patient.bezeichnung2.match(name)
    );
  }
  function refilter() {
    billService
      .find({
        query: {
          $limit: 100,
          rnstatus: InvoiceState[billstate],
          patientid: name,
        },
      })
      .then((result: query_result) => {
        bills = result.data;
      });
  }
</script>

<template>
  <div class="flex flex-col lg:flex-row">
    <div
      class="flex-auto my-3 p-1 border-2 border-solid border-blue-400 rounded max-h-full max-w-full"
    >
      <h2 class="mx-3">{$_("titles.bills")}</h2>
      <select bind:value={billstate} on:change={select} on:click={select}>
        {#each states as state}
          <option value={state}>{$_("billing." + state)}</option>
        {/each}
      </select>
      <input type="text" bind:value={name} />
      <button on:click={refilter}>Filter</button>
      <Bills {bills} filter={patfilter} />
    </div>
    <div class="flex-auto">
      <Unbilled />
    </div>
  </div>
</template>
