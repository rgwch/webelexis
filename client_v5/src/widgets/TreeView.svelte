<script lang="ts">
  import { Tree } from "../models/tree";
  const dtree = new Tree<string>(null, "root");
new Tree<string>(dtree, "one");
new Tree<string>(dtree, "two");

  export let tree: Tree<any>=dtree
  export let labelProvider: (x: Tree<any>) => string;
  $: list=tree.getChildren()
</script>

<template>
  <div class="bg-green-200">
  {#each list as e}
    <p>{labelProvider(e)}</p>
  {/each}
</div>
</template>
