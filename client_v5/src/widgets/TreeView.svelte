<script lang="ts">
  import type { Tree } from "../models/tree";
  export let tree: Tree<any>;
  export let labelProvider: (x: Tree<any>) => string;
  const list=tree.getChildren()
</script>

<template>
  {#each list as e}
    <p>{labelProvider(e)}</p>
  {/each}
</template>
