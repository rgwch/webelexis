<script lang="ts">
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();
dispatch("test", { message: "loaded" });
</script>

<template>
  <p>Hello Test</p>
</template>
