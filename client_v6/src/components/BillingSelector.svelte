<script lang="ts">
  import LineInput from "../widgets/LineInput.svelte";
  import { LeistungsblockManager } from "../models/leistungsblock-model";
  import { BillingsManager, type BillingType } from "../models/billings-model";
  import { getService } from "../services/io";
  import Collapse from "../widgets/Collapse.svelte";

  const billableService = getService("billable");
  const blockManager = new LeistungsblockManager();
  const bm = new BillingsManager();
  let billables:Array<BillingType> = [];
  let blocks = [];
  blockManager.find({}).then((result) => {
    blocks = result.data;
  });
  async function show(name: string) {
    for (let block of blocks) {
      if (block.name == name) {
        block.opened = true;
        billables = await blockManager.getElements(block);
      } else {
        block.opened = false;
      }
    }
  }
</script>

<template>
  {#each blocks as block}
    <Collapse
      title={block.name}
      bind:open={block.opened}
      on:open={() => show(block.name)}
    >
      <div slot="body">
        {#each billables as item}
          <p>{item.code} {item.tx255}</p>
        {/each}
      </div>
    </Collapse>
  {/each}
</template>
