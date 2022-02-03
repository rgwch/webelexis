<script lang="ts">
  import Bills from "../components/Bills.svelte";
  import Unbilled from "../components/Unbilled.svelte";
  import { getService } from "../services/io";
  import { InvoiceState } from "../models/invoice";
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
  <div class="container mx-auto">
    <select bind:value={billstate} on:change={select} on:click={select}>
      {#each states as state}
        <option value={state}>{$_("billing." + state)}</option>
      {/each}
    </select>
    <input type="text" bind:value={name} />
    <button on:click={refilter}>Filter</button>
    <Bills {bills} filter={patfilter} />
    <Unbilled></Unbilled>
  </div>
</template>
