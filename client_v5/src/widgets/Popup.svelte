<script lang="ts">
import { createEventDispatcher } from "svelte";
import {slide} from 'svelte/transition'
const dispatch = createEventDispatcher();
export let items: Array<string> = [];
let open: boolean = false;
</script>

<template>
  <div class="relative">
    <div
      class="relative"
      on:click="{() => {
        open = !open;
      }}">
      Open
    </div>
    {#if open}
      <ul class="absolute">
        {#each items as item}
          <li
            class="my-0 py-0 ml-2 hover:text-blue-600 cursor-pointer"
            transition:slide
            on:click="{() => {
              dispatch('selected', item);
              open=false;
            }}">
            {item}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</template>
