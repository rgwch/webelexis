<script lang="ts">
import { createEventDispatcher, onMount, onDestroy } from "svelte";
import { slide } from "svelte/transition";
const dispatch = createEventDispatcher();
export let title = "";
export let items: Array<string> = [];
export let level = 0;

let open: boolean = false;
let parent: Element;

function submenu(subitems: Array<string>) {
  const subtitle = subitems.splice(0, 1)[0];
  return { title: subtitle, items: subitems, level: level + 1 };
}

function clickListener(event) {
  if (parent != event.target && !parent.contains(event.target)) {
    open = false;
  }
}
onMount(() => {
  document.addEventListener("click", clickListener);
});
onDestroy(() => {
  document.removeEventListener("click", clickListener);
});
</script>

<template>
  <div class="relative" bind:this="{parent}">
    <div
      class="relative cursor-pointer py-0 my-0 hover:text-blue-600"
      on:click|stopPropagation="{() => {
        open = !open;
      }}">
      {#if level === 0 && title == ""}
        <svg width="20" height="30">
          <rect y="2" x="3" width="15" height="3" style="fill:rgb(0,0,0)"
          ></rect>
          <rect y="9" x="3" width="15" height="3" style="fill:rgb(0,0,0)"
          ></rect>
          <rect y="16" x="3" width="15" height="3" style="fill:rgb(0,0,0)"
          ></rect>
        </svg>
      {:else}
        {title}
      {/if}
    </div>
    {#if open}
      <div class="bg-green-800 z-100 opacity-100">
        <ul
          class="absolute left-2 top-3 py-0 my-0 border-2 bg-gray-100 list-none">
          {#each items as item}
            {#if Array.isArray(item)}
              <li>
                <svelte:self {...submenu([...item])} on:selected />
              </li>
            {:else}
              <li
                class="relative w-50 my-0 py-0 hover:text-blue-600 cursor-pointer"
                transition:slide
                on:click="{() => {
                  dispatch('selected', item);
                  open = false;
                }}">
                {item}
              </li>
            {/if}
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</template>
