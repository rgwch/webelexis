<script lang="ts">
  import LineInput from "../widgets/LineInput.svelte";
  import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
  import { _ } from "svelte-i18n";
  import { prescriptionManager } from "../models";
  import type { ArticleType } from "src/models/prescription-model";
  let searchTerm = "";
  async function doSearch() {
    found = await prescriptionManager.findArticle(searchTerm);
  }
  let found: Array<ArticleType> = [];
  function select(a: ArticleType) {}
  function drag(event) {
    const obj = found.find((el) => event.target.id == el.dscr);
    event.dataTransfer.setData("text/plain", obj.id);
    event.dataTransfer.setData("webelexis/datatype", "article");
    event.dataTransfer.setData("webelexis/object", JSON.stringify(obj));
    return true;
  }
</script>

<template>
  <div>
    <LineInput
      label={$_("prompts.articlesearch")}
      bind:value={searchTerm}
      on:textChanged={doSearch}
      buttonIcon={faMagnifyingGlass}
    />
  </div>
  <div class="border-1 overflow-auto h-full">
    {#each found as entry}
      <p
        class="my-0 cursor-pointer hover:text-blue-400"
        draggable="true"
        on:dragstart={drag}
        id={entry.dscr}
      >
        {entry.dscr}
      </p>
    {/each}
  </div>
</template>
