<script lang="ts">
import { slide } from "svelte/transition";
export let open = false;
export let title = "";
export let locked = false;
</script>

<template>
  <div>
    {#if locked}
      <slot name="header">
        <span class="text-sm">{title}</span>
      </slot>
    {:else}
      <div on:click="{() => (open = !open)}" class="cursor-pointer">
        <slot name="header">
          <span class="text-sm">{title}</span>
        </slot>
      </div>
      {#if open}
        <div transition:slide="{{ duration: 100 }}">
          <slot name="body" />
        </div>
      {/if}
    {/if}
  </div>
</template>
