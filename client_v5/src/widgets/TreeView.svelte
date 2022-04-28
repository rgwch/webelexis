<script lang="ts">
  import Fa from "svelte-fa";
  import { faCaretRight, faCaretDown } from "@fortawesome/free-solid-svg-icons";
  import type { Tree } from "../models/tree";

  export let trees: Array<Tree<any>>;
  export let labelProvider: (x: Tree<any>) => string;
</script>

<template>
  <div class="bg-green-200 static">
    {#each trees as e}
      <p class="my-0">
        {#if e.props.open}
          <Fa icon={faCaretDown} />
          <span
            on:click={() => (e.props.open = !e.props.open)}
            class="cursor-pointer">{labelProvider(e)}</span
          >
          <div class="relative left-2">
            <svelte:self trees={e.getChildren()} {labelProvider} />
          </div>
        {:else}
          <Fa icon={faCaretRight} />
          <span
            on:click={() => (e.props.open = !e.props.open)}
            class="cursor-pointer">{labelProvider(e)}</span
          >
        {/if}
      </p>
    {/each}
  </div>
</template>

<style>
</style>
