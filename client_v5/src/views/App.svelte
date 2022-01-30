<script lang="ts">
  import Bills from "../components/Bills.svelte";
  import { getService } from "../services/io";
  import { InvoiceState } from "../models/invoice";
  import { _ } from "svelte-i18n";

  let bills;
  const billService = getService("bills");
  billService.find({ query: { $limit: 5 } }).then((result: query_result) => {
    bills = result.data;
  });
  let states: Array<string> = [];

  for (let value in InvoiceState) {
    if (typeof InvoiceState[value] === "number") {
      states.push(value);
    }
  }
  let billstate;
  let name: string;
  function select() {
    billService
      .find({ query: { $limit: 5, rnstatus: InvoiceState[billstate] } })
      .then((result: query_result) => {
        bills = result.data;
      });
  }
  function refilter() {
    if (name) {
      billService.find({ query: { patientid: 2 } }).then((result) => {
        bills = result.data;
      });
    }
  }
</script>

<template>
  <select bind:value={billstate} on:change={select} on:click={select}>
    {#each states as state}
      <option value={state}>{$_("billing." + state)}</option>
    {/each}
  </select>
  <input type="text" bind:value={name} />
  <button on:click={refilter}>Suche</button>
  <Bills {bills} />
</template>
