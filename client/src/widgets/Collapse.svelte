<script lang="ts">
  import { slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let open = false;
  export let title = "";
  export let locked = false;

  function clicked() {
    open = !open;
    dispatch("open", open);
  }
</script>

<template>
  <div>
    {#if locked}
      <slot name="header">
        <span class="text-sm">{title}</span>
      </slot>
    {:else}
      <div on:click={clicked} class="cursor-pointer">
        <slot name="header">
          <span class="text-sm">{title}</span>
        </slot>
      </div>
      {#if open}
        <div transition:slide={{ duration: 100 }}>
          <slot name="body" class="h-auto" />
        </div>
      {/if}
    {/if}
  </div>
</template>
