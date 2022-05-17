<script lang="ts">
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
        <slot name="body" />
      {/if}
    {/if}
  </div>
</template>
