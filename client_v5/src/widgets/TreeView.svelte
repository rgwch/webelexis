<script lang="ts">
  import "../../node_modules/@fortawesome/fontawesome-free/js/solid";
  import "../../node_modules/@fortawesome/fontawesome-free/js/fontawesome";

  import type { Tree } from "../models/tree";
  export let tree: Tree<any>;
  export let labelProvider: (x: Tree<any>) => string;
  $: list = tree.getChildren();
  function toggle(t: Tree<any>) {
    t.props.open = !t.props.open;
    
  }
</script>

<template>
  <div class="bg-green-200">
    {#each list as e}
      <p>
        {#if !e.props.open}
          <i class="fas fa-caret-down"  />
        {:else}
          <i class="fas fa-caret-right" />
        {/if}
        <span on:click={() => toggle(e)} class="cursor-pointer">{labelProvider(e)}</span>
      </p>
    {/each}
  </div>
</template>
