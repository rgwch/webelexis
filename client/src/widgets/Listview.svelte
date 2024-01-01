<script lang="ts">
  export let list: Array<any> = []
</script>

<template>
  <ul>
    {#each list as element}
      <li>{element}</li>
    {/each}
  </ul>
</template>
