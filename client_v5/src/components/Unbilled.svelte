<script lang="ts">
  import { Billing } from '../services/billing'
  import type { konsdef } from '../services/billing'
  import type { Tree } from '../models/tree'
  import { DateTime } from 'luxon'
  import { CaseManager } from '../models/case-model'
  import type { CaseType } from '../models/case-model'
  import { EncounterManager, EncounterModel } from '../models/encounter-model'
  import type { EncounterType } from '../models/encounter-model'
  import { _ } from 'svelte-i18n'
  import '../../node_modules/@fortawesome/fontawesome-free/js/solid'
  import '../../node_modules/@fortawesome/fontawesome-free/js/fontawesome'
  
  const cm = new CaseManager()
  const em = new EncounterManager()
  let patients: Array<Tree<konsdef>> = []
  const biller = new Billing()
  biller.getBillables().then((result) => {
    patients = result.getChildren()
  })
  function toggle(t: Tree<konsdef>) {
    t.props.open = !t.props.open
    patients = patients
  }

  async function getFall(t: Tree<konsdef>): Promise<CaseType> {
    if (!t.payload.Fall) {
      t.payload.Fall = await cm.fetch(t.payload.fallid)
    }
    return t.payload.Fall
  }
  async function getEncounter(t: Tree<konsdef>): Promise<EncounterModel> {
    if (!t.payload.Konsultation) {
      t.payload.Konsultation = await em.fetch(t.payload.konsid)
    }
    return new EncounterModel(t.payload.Konsultation)
  }
</script>

<template>
  <div class="border-2 border-solid border-blue-400 rounded my-3 p1">
    <h2 class="mx-3">{$_('titles.unbilled')}</h2>
    <ul class="max-h-[80vh] overflow-auto">
      {#each patients as p}
        <li on:click={() => toggle(p)} class="cursor-pointer">
          {p.payload.lastname} {p.payload.firstname}
          {#if p.props.open}
            <ul>
              {#each p.getChildren() as f, k}
                <li on:click|stopPropagation={() => toggle(f)}>
                  {#await getFall(f)}
                    {$_('general.loading')}
                  {:then}
                    {cm.getLabel(f.payload.Fall)}
                  {/await}
                  {#if f.props.open}
                    <ul>
                      {#each f.getChildren() as e}
                        <li>
                          {#await getEncounter(e)}
                            {$_('general.loading')}
                          {:then enc}
                            {#await enc.getLabel()}
                              {$_('general.loading')}
                            {:then label}
                              {label}
                            {/await}
                          {/await}
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
