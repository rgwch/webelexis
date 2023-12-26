<script lang="ts">
  import { Tabs, Tab, TabList, TabPanel } from "svelte-tabs";
  import EncountersByDate from "../components/EncountersByDate.svelte";
  import Bills from "../components/Bills.svelte";
  import Unbilled from "../components/Unbilled.svelte";
  import Cash from "../components/Cash.svelte";
  import { getService } from "../services/io";
  import { InvoiceState } from "../models/invoice-model";
  import type { InvoiceType } from "../models/invoice-model";
  import { _ } from "svelte-i18n";
  import BillingSelector from "../components/BillingSelector.svelte";

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
    return result.data.sort((a, b) => {
      return b.rnnummer.localeCompare(a.rnnummer);
    });
  }
  let states: Array<string> = [];

  // Build Array of possible Bill states
  for (let value in InvoiceState) {
    if (typeof InvoiceState[value] === "number") {
      states.push(value);
    }
  }

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
  <Tabs>
    <TabList>
      <Tab>{$_("titles.fromdate")}</Tab>
      <Tab>{$_("titles.unbilled")}</Tab>
      <Tab>{$_("titles.bills")}</Tab>
      <Tab>{$_("titles.positions")}</Tab>
      <Tab>{$_("titles.cash")}</Tab>
    </TabList>

    <TabPanel>
      <EncountersByDate />
    </TabPanel>
    <TabPanel>
      <Unbilled />
    </TabPanel>
    <TabPanel>
      <div>
        <h2 class="mx-3">{$_("titles.bills")}</h2>
        <select bind:value={billstate} on:change={reload} on:click={reload}>
          {#each states as state}
            <option value={state}>{$_("billing." + state)}</option>
          {/each}
        </select>
        <input type="text" bind:value={name} />
        <button on:click={reload}>Filter</button>
        <Bills {bills} filter={patfilter} {busy} on:success={reload} />
      </div>
    </TabPanel>
    <TabPanel>
      <BillingSelector />
    </TabPanel>
  </Tabs>
</template>
