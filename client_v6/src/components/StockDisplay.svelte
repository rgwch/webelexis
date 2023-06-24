<script lang="ts">
  import type { StockEntryType } from "../models/stock-model";
  import { StockManager } from "../models/stock-model";
  import { createEventDispatcher } from "svelte";
  const stockmgr = new StockManager();
  const dispatch = createEventDispatcher();
  let stockobjects: Array<StockEntryType> = [];

  stockmgr.find({ query: { $limit: 100 } }).then((result) => {
    Promise.all(result.data.map((i) => stockmgr.getTitle(i))).then((texted) => {
      stockobjects = result.data
        .filter((it) => it._Article)
        .sort((a, b) => {
          return a._Title.localeCompare(b._Title);
        });
    });
  });
</script>

<template>
  <div class="border-1 overflow-auto h-full">
    {#each stockobjects as item}
      {#await stockmgr.getLabel(item) then label}
        <p
          class="my-y cursor-pointer hover:text-blue-400"
          on:click={() => dispatch("select", item)}
        >
          {label}
        </p>
      {/await}
    {/each}
  </div>
</template>
