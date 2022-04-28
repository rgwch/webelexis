<script lang="ts">
  import Fa from "svelte-fa";
  import { faCaretRight, faCaretDown, faGripVertical } from "@fortawesome/free-solid-svg-icons";
  import type { Tree, ITreeListener } from "../models/tree";

  export let trees: Array<Tree<any>>;
  export let labelProvider: (x: Tree<any>) => string;
  function handleDragStart(event){

  }
</script>

<template>
  <div class="bg-green-200 static overflow-x-hidden overflow-y-auto">
    {#each trees as e}
      <p class="my-1 px-2 my-1" draggable="true" on:dragstart={handleDragStart}>
        <Fa class="mx-2 cursor-move" icon={faGripVertical} />
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
