<script lang="ts">
  import { Billing, type konsdef } from '../services/billing'
  import type {Tree} from '../models/tree'
  import {DateTime} from 'luxon'
  import {_} from 'svelte-i18n'

  let patients:Array<Tree<konsdef>>=[]
  const biller = new Billing()
  biller.getBillables().then((result) => {
    patients=result.getChildren()
  })
  function toggle(t:Tree<konsdef>){
      t.props.open=!t.props.open
      patients=patients
  }
</script>

<template>
  {#each patients as p, idx}
    <p on:click={() => toggle(p)}>
      {p.payload.lastname}
      {p.payload.firstname}
      {#if p.props.open}
        {#each p.getChildren() as f, k}
          <p on:click|stopPropagation={() => toggle(f)}>
            {DateTime.fromISO(f.payload.falldatum).toFormat($_("formatting.date"))}
            {f.payload.falltitel}
            {#if f.props.open}
              {#each f.getChildren() as e}
                <p>
                  {DateTime.fromISO(e.payload.konsdatum).toFormat($_("formatting.date"))}
                </p>
              {/each}
            {/if}
          </p>
        {/each}
      {/if}
    </p>
  {/each}
</template>
