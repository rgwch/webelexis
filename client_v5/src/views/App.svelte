<script lang="ts">
  import { _ } from 'svelte-i18n'
  import Bills from '../components/Bills.svelte'
  import type { Invoice } from '../models/invoice'
  import { getOpenBills } from '../services/io'
  
  let bills:Array<Invoice>=[]
  getOpenBills().then((result) => {
    bills = result
  })
</script>

<template>
  <Bills {bills}></Bills>
</template>
