<script lang="ts">
  import LineInput from "../widgets/LineInput.svelte";
  import { LeistungsblockManager } from "../models/leistungsblock-model";
  import { billingsManager as bm, type BillingType } from "../models/billings-model";
  import { getService } from "../services/io";
  import Collapse from "../widgets/Collapse.svelte";

  const blockManager = new LeistungsblockManager();
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
          <p>{bm.getLabel(item)}</p>
        {/each}
      </div>
    </Collapse>
  {/each}
</template>
