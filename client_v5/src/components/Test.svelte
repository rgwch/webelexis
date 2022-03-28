<script lang="ts">
  /** This is the Title of the Component*/
  export let title: string
  /** Tailwind/Windi class for the title.*/
  export let color: string = 'text-blue-800'
</script>

<template>
  <h1 class="text-center text-2xl font-bold {color}">{title}</h1>
  <p class="bg-red-400 px-10 mx-4">
    This is a Svelte Component included from the App. If this has a red
    background, WindiCSS worked in the component (components/Test.svelte).
  </p>
</template>
