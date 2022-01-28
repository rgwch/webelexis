<script lang="ts">
  import Bills from "../components/Bills.svelte";
  import { getService } from "../services/io";
  let bills;
  const billService = getService("bills");
  billService.find({ query: { $limit: 2 } }).then((result: query_result) => {
    bills = result.data;
  });
</script>

<template>
  <Bills {bills} />
</template>
