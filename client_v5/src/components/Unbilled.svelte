<script lang="ts">
  import { Billing, type konsdef } from '../services/billing'
  import {Tree} from '../models/tree'

  let openKons:Array<Tree<konsdef>>=[]
  const biller = new Billing()
  biller.getBillables().then((result) => {
    return result.getChildren().then((pats)=>{
      openKons=pats
    })
  })

</script>

<template>
  {#each openKons as k}
    <p>
      {k.getPayload().lastname}
      {k.getPayload().firstname}
      {k.getPayload().falldatum}
      {k.getPayload().falltitel}
      {k.getPayload().konsdatum}
    </p>
  {/each}
</template>
