<script lang="ts">
  import LineInput from "../widgets/LineInput.svelte";
  import { LeistungsblockManager } from "../models/leistungsblock-model";
  import { getService } from "../services/io";
  import Collapse from "../widgets/Collapse.svelte";

  const billableService = getService("billable");
  const blockManager = new LeistungsblockManager();
  let billables = [];
  let blocks = [];
  blockManager.find({}).then((result) => {
    blocks = result.data;
  });
</script>

<template>
  {#each blocks as block}
    <Collapse title={block.name}>
      <div slot="body">
        {#each block.elemente as item}
          <p>{item.code}</p>
        {/each}
      </div>
    </Collapse>
  {/each}
</template>
