<script lang="ts">
  import { Billing, type konsdef } from '../services/billing'
  import type {Tree} from '../models/tree'
import properties from '../services/properties'

  let patients:Array<Tree<konsdef>>=[]
  const biller = new Billing()
  biller.getBillables().then((result) => {
    patients=result.getChildren()
  })
  function toggle(t:Tree<konsdef>){
      t.props.open=!t.props.open
  }
</script>

<template>
  {#each patients as p, idx}
    <p on:click={() => toggle(p)}>
      {p.payload.lastname}
      {p.payload.firstname}
      {#if p.props.open}
        {#each p.getChildren() as f, k}
          <p on:click={() => toggle(f)}>
            {f.payload.falldatum}
            {f.payload.falltitel}
            {#if f.props.open}
              {#each f.getChildren() as e}
                <p>
                  {e.payload.konsdatum}
                </p>
              {/each}
            {/if}
          </p>
        {/each}
      {/if}
    </p>
  {/each}
</template>
