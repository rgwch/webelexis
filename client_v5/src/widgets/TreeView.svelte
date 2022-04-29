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

export let trees: Array<Tree<any>>;
export let labelProvider: (x: Tree<any>) => string;
const dispatch = createEventDispatcher();
function handleDragStart(event, node) {
  event.dataTransfer.effectAllowed = "move";
  const id = uuid();
  global.volatile[id] = node;
  event.dataTransfer.setData("text/plain", id);
  event.target.style.opacity = "0.4";
}
function handleDragEnd(event) {
  event.target.style.opacity = "1.0";
}
function dropped(event) {
  const id = event.dataTransfer.getData("text/plain");
  console.log(id);
  const tree = global.volatile[id];
  if (!trees) {
    trees = new Array<Tree<any>>();
  }
  trees.push(tree);
  trees = trees;
}
function dragenter(event) {
  // event.target.style.backgroundColor="red"
  console.log("enter");
}
function dragleave(event) {
  console.log("leave");
}
function dragover(event) {
  return false;
}
</script>

<template>
  <div
    class="bg-green-200 static overflow-x-hidden overflow-y-auto max-h-[80vh] h-4/5"
    on:drop|preventDefault|stopPropagation="{dropped}"
    on:dragenter|preventDefault="{dragenter}"
    on:dragleave|preventDefault="{dragleave}"
    on:dragover|preventDefault="{dragover}">
    {#each trees as e, index}
      <p
        class="my-1 px-2 my-1"
        draggable="true"
        on:dragstart="{(event) => handleDragStart(event, e)}"
        on:dragend="{handleDragEnd}">
        <Fa class="mx-2 cursor-move" icon="{faGripVertical}" />
        {#if e.props.open}
          <Fa icon="{faCaretDown}" />
          <span
            on:click="{() => {
              e.props.open = !e.props.open;
              dispatch('selected', e);
            }}"
            class="cursor-pointer">{labelProvider(e)}</span>
          <div class="relative left-2">
            <svelte:self
              trees="{e.getChildren()}"
              labelProvider="{labelProvider}"
              on:selected />
          </div>
        {:else}
          <Fa icon="{faCaretRight}" />
          <span
            on:click="{() => {
              e.props.open = !e.props.open;
              dispatch('selected', e);
            }}"
            class="cursor-pointer">{labelProvider(e)}</span>
        {/if}
      </p>
    {/each}
  </div>
</template>
