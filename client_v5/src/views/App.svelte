<script lang="ts">
  import Bills from "../components/Bills.svelte";
  import { getService } from "../services/io";
  let bills;
  const billService = getService("bills");
  billService.find({}).then((result) => {
    bills = result;
  });
</script>

<template>
  <Bills {bills} />
</template>
