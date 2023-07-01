<script lang="ts">
  import type { StockEntryType } from "../models/stock-model";
  import { StockManager } from "../models/stock-model";
  import { createEventDispatcher } from "svelte";
  import type { ArticleType } from "../models/prescription-model";
  const stockmgr = new StockManager();
  const dispatch = createEventDispatcher();
  let stockobjects: Array<StockEntryType> = [];
  let dropzone: HTMLElement;

  function load() {
    stockmgr.find({ query: { $limit: 100 } }).then((result) => {
      Promise.all(result.data.map((i) => stockmgr.getTitle(i))).then(
        (texted) => {
          stockobjects = result.data
            .filter((it) => it._Article)
            .sort((a, b) => {
              return a._Title.localeCompare(b._Title);
            });
        }
      );
    });
  }
  /**
   * create  visual feedback for possible drop zones when dragging a prescription or an article
   * @param mode
   */
  function mark(mode: boolean) {
    if (mode) {
      dropzone.style.border = "dashed 2px orange";
    } else {
      dropzone.style.border = "none";
    }
  }
  /**
   * user drags an object over us. We'll accept only if it is a "Webelexis" object.
   * @param event
   */
  function dragOver(event) {
    if (event.dataTransfer.types.find((el) => el.startsWith("webelexis"))) {
      event.preventDefault();
      mark(true);
    }
    return true;
  }
  /**
   * User dropped an item (article or prescription) on us.
   * @param event
   */
  function dragDrop(event) {
    event.preventDefault();
    mark(false);
    const datatype = event.dataTransfer.getData("webelexis/datatype");
    const json = event.dataTransfer.getData("webelexis/object");
    if (datatype == "article") {
      const obj: ArticleType = JSON.parse(json);
      stockmgr.addArticle(obj).then((item) => {
        stockobjects.push(item);
        load();
      });
    }
  }
  /**
   * drag/drop operation is finished or cancelled
   * @param event
   */
  function dragLeave(event) {
    mark(false);
  }
  load();
</script>

<template>
  <div
    class="border-1 overflow-auto h-full"
    bind:this={dropzone}
    on:dragover={dragOver}
    on:drop={dragDrop}
    on:dragleave={dragLeave}
  >
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
