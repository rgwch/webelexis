<script lang="ts">
import { labresultManager } from "../models";
import type { LabresultType } from "../models/labresult-model";
import Collapse from "../widgets/Collapse.svelte";
import Sparkline from "sparklines";
import { onMount } from "svelte";
import { _ } from "svelte-i18n";

export let items: Array<LabresultType> = [];
let min: number = Number.MAX_VALUE;
let max: number = Number.MIN_VALUE;
let values = items
  .map((el) => parseFloat(el.resultat))
  .filter((v) => {
    if (typeof v == "number") {
      if (v > max) {
        max = v;
      }
      if (v < min) {
        min = v;
      }
      return true;
    }
    return false;
  });
let spark: Element;
onMount(() => {
  const sparklines = new Sparkline(spark);
  sparklines.draw(values.reverse());
});
</script>

<template>
  {#if items.length > 0}
    <Collapse>
      <div slot="header">
        <span class="bg-blue-100" bind:this="{spark}"></span>
        <span> {items[0].titel}</span>
        <span class:text-red-500="{labresultManager.isPathologic(items[0])}">
          {@html labresultManager.shortLabel(items[0])}
        </span>
        <span>
          ({$_("lab.resultsbetween", {
            values: {
              lower: min,
              upper: max,
            },
          })}),
        </span>
        <span
          >{$_("lab.normrange", { values: { ref: items[0].reference } })}</span>
      </div>
      <div slot="body">
        <div class="flex flex-wrap">
          {#each items as val}
            <div class="p-1 m-1 border-2 bg-blue-100">
              {@html labresultManager.shortLabel(val)}
            </div>
          {/each}
        </div>
      </div>
    </Collapse>
  {/if}
</template>
