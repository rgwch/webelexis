<script lang="ts">
export let open = false;
export let title = "";
</script>

<template>
  <div class="m-2 p-2 pr-4 border-1 bg-blue-200 rounded-4">
  <div on:click="{() => (open = !open)}" class="cursor-pointer">
    <slot name="header">
      <span class="text-sm">{title}</span>
    </slot>
  </div>
  <!-- div class:hidden="{open === false}" -->
  {#if open}
    <slot name="body" />
  {/if}
  <!-- /div -->
</div>
</template>
