<script lang="ts">
  import Fa from "svelte-fa";
  import { faCaretRight, faCaretDown } from "@fortawesome/free-solid-svg-icons";
  import type { Tree } from "../models/tree";

  export let trees: Array<Tree<any>>;
  export let labelProvider: (x: Tree<any>) => string;
</script>

<template>
  <div class="bg-green-200">
    {#each trees as e}
      <p>
        <!-- i class={e.props.open ? "fas fa-caret-down" : "fas fa-caret-right"} / -->
        {#if e.props.open}
          <Fa icon={faCaretDown} />
        {:else}
          <Fa icon={faCaretRight} />
        {/if}
        <span
          on:click={() => (e.props.open = !e.props.open)}
          class="cursor-pointer">{labelProvider(e)}</span
        >
      </p>
    {/each}
  </div>
</template>

<style>
</style>
