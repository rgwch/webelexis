<script lang="ts">
export let title = "";
export let contents = "";
</script>

<template>
  <div
    class="bg-blue-100 overflow-hidden shadow rounded-lg divide-y divide-gray-200 m-2 p-2">
    <slot name="heading">
      <div class="px-4 py-3 sm:px-6 bg-gray-200">
        <h2 class="text-blue-500">{title}</h2>
      </div>
    </slot>
    <slot name="body">
      <div class="px-3 py-2 sm:p-6">
        <p>{contents}</p>
      </div>
    </slot>
  </div>
</template>
