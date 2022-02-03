<script lang="ts">
  import { Billing, type konsdef } from '../services/billing'
  import type {Tree} from '../models/tree'
  import {DateTime} from 'luxon'
  import {t, _} from 'svelte-i18n'
  import '../../node_modules/@fortawesome/fontawesome-free/js/solid';
	import '../../node_modules/@fortawesome/fontawesome-free/js/fontawesome';
import properties from '../services/properties';
	
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
  <div class="my-3 border-2 border-solid border-blue-400 rounded max-h-[80vh] overflow-auto max-w-1/2">
    <h2 class="mx-3">{$_("titles.unbilled")}</h2>
    <ul>
      {#each patients as p}
        <li on:click={() => toggle(p)} class="cursor-pointer">
          {p.payload.lastname}
          {p.payload.firstname}
          {#if p.props.open}
            <ul>
              {#each p.getChildren() as f, k}
                <li on:click|stopPropagation={() => toggle(f)}>
                  {DateTime.fromISO(f.payload.falldatum).toFormat(
                    $_("formatting.date")
                  )}
                  {f.payload.falltitel}
                  {#if f.props.open}
                    <ul>
                      {#each f.getChildren() as e}
                        <li>
                          {DateTime.fromISO(e.payload.konsdatum).toFormat(
                            $_("formatting.date")
                          )}
                        </li>
                      {/each}
                    </ul>
                  {/if}
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</template>
