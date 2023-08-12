<script lang="ts">
  import LineInput from "../widgets/LineInput.svelte";
  import { LeistungsblockManager } from "../models/leistungsblock-model";
  import { billingsManager as bm, type Billable } from "../models/billings-model";
  import { getService } from "../services/io";
  import Collapse from "../widgets/Collapse.svelte";
  import { isNodeEmpty } from "@tiptap/core";

  const blockManager = new LeistungsblockManager();
  let blocks = [];
  blockManager.find({}).then((result) => {
    blocks = result.data.sort((a,b)=>{return a.name.localeCompare(b.name)});
  });
  async function show(name: string,detail) {
    for (let block of blocks) {
      if (block.name == name) {
        block.opened = detail;
      } else {
        block.opened = false;
      }
    }
  }
  function drag(event){
    event.dataTransfer.setData("text",event.target.id)
  }
</script>

<template>
  {#each blocks as block}
    <Collapse
      title={block.name}
      bind:open={block.opened}
      on:open={(event) => show(block.name, event.detail)}
    >
      <div slot="body">
        {#each block.billables || [] as item}
          <p
            draggable="true"
            on:dragstart={drag}
            id={item.system + "!" + item.code}
          >
            {item.code}
            {item.text}
          </p>
        {/each}
      </div>
    </Collapse>
  {/each}
</template>
