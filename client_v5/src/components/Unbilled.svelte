<script lang="ts">
  import { Billing } from '../services/billing'
  let openKons
  const biller = new Billing()
  biller.getBillables().then((result) => {
    openKons = result
  })
</script>

<template>
  <p>Result: {JSON.stringify(openKons)}</p>
</template>
