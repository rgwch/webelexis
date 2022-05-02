<script lang="ts">
import Fa from "svelte-fa";
import {
  faCaretRight,
  faCaretDown,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import type { Tree, ITreeListener } from "../models/tree";
import global from "../services/properties";
import { v4 as uuid } from "uuid";
import { createEventDispatcher } from "svelte";
const DND_TYPE = "application/x-webelexis-treeview";

export let trees: Array<Tree<any>>;
export let labelProvider: (x: Tree<any>) => string;
const dispatch = createEventDispatcher();
function handleDragStart(event, node) {
  event.dataTransfer.effectAllowed = "move";
  const id = uuid();
  global.volatile[id] = node;
  event.dataTransfer.setData(DND_TYPE, id);
  event.target.style.opacity = "0.4";
  event.target["data-id"] = id;
}
function handleDragEnd(event) {
  event.target.style.opacity = "1.0";

  const id = event.target["data-id"];
  // console.log("dropped " + id);

  const tree: Tree<any> = global.volatile[id];
  if (tree) {
    tree.remove;
    const index = trees.findIndex((t) => t.payload == tree.payload);
    if (index != -1) {
      trees.splice(index, 1);
      trees = trees;
    }
    delete global.volatile[id];
  }
}
function dropped(event) {
  const id = event.dataTransfer.getData(DND_TYPE);
  // console.log(id);
  const tree = global.volatile[id];
  if (!trees) {
    trees = new Array<Tree<any>>();
  }
  trees.push(tree);
  trees = trees;
}
function dragenter(event) {
  // event.target.style.backgroundColor="red"
}
function dragleave(event) {}
function dragover(event) {
  event.dataTransfer.effectAllowed = "move";
}
</script>

<template>
  <div
    class="bg-green-200 static overflow-x-hidden overflow-y-auto max-h-[80vh] h-4/5"
    on:drop|preventDefault|stopPropagation="{dropped}"
    on:dragenter|preventDefault="{dragenter}"
    on:dragleave|preventDefault="{dragleave}"
    on:dragover|preventDefault="{dragover}"
  >
    {#each trees as e, index}
      <p
        class="px-2 my-0"
        draggable="true"
        on:dragstart="{(event) => handleDragStart(event, e)}"
        on:dragend="{handleDragEnd}"
      >
        <!-- Fa class="mx-2 cursor-move" icon="{faGripVertical}" / -->
        <span
          on:click="{() => {
            e.props.open = !e.props.open;
          }}"
          class="cursor-pointer"
        >
          <Fa icon="{e.props.open ? faCaretDown : faCaretRight}" /></span
        >
        {#if e.props.open}
          <span class="mx-2 my-0" on:click="{() => dispatch('selected', e)}">
            {labelProvider(e)}</span
          >
          <div class="relative left-2">
            <svelte:self
              trees="{e.getChildren()}"
              labelProvider="{labelProvider}"
              on:selected
            />
          </div>
        {:else}
          <span class="mx-2 my-0" on:click="{() => dispatch('selected', e)}">
            {labelProvider(e)}</span
          >
        {/if}
      </p>
    {/each}
  </div>
</template>
