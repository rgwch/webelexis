<script lang="ts">
import Bills from "../components/Bills.svelte";
import Unbilled from "../components/Unbilled.svelte";
import { getService } from "../services/io";
import { InvoiceState } from "../models/invoice-model";
import type { InvoiceType } from "../models/invoice-model";
import { Tree } from "../models/tree";
import TreeView from "../widgets/TreeView.svelte";
import { _ } from "svelte-i18n";

const fetchsize = 80;
let bills: Array<InvoiceType> = [];
let billstate = InvoiceState[4]; // Open
let name: string;
let busy = false;

const billService = getService("bills");

async function reload(): Promise<Array<InvoiceType>> {
  const query = { $limit: fetchsize, rnStatus: InvoiceState[billstate] };
  if (name) {
    query["patientid"] = name;
  }
  busy = true;
  const result = await billService.find({ query });
  bills = result.data;
  busy = false;
  return result.data;
}
let states: Array<string> = [];

// Build Array of possible Bill states
for (let value in InvoiceState) {
  if (typeof InvoiceState[value] === "number") {
    states.push(value);
  }
}

const tree = new Tree<string>(null, "root");
new Tree<string>(tree, "one");
new Tree<string>(tree, "two");

function patfilter(bill): boolean {
  if (!name) {
    return true;
  }
  if (!bill) {
    return false;
  }

  return (
    bill._Fall?._Patient?.bezeichnung1?.match(name) ||
    bill._Fall?._Patient?.bezeichnung2?.match(name)
  );
}
</script>

<template>
  <TreeView tree="{tree}" labelProvider="{(s) => JSON.stringify(s.payload)}" />
  <div class="flex flex-col lg:flex-row">
    <div
      class="flex-auto my-3 p-1 border-2 border-solid border-blue-400 rounded
      max-h-full max-w-full">
      <h2 class="mx-3">{$_("titles.bills")}</h2>
      <select bind:value="{billstate}" on:change="{reload}" on:click="{reload}">
        {#each states as state}
          <option value="{state}">{$_("billing." + state)}</option>
        {/each}
      </select>
      <input type="text" bind:value="{name}" />
      <button on:click="{reload}">Filter</button>
      <Bills bills="{bills}" filter="{patfilter}" busy="{busy}" />
    </div>
    <div class="flex-auto">
      <Unbilled />
    </div>
  </div>
</template>
