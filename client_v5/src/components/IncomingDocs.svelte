<script lang="ts">
  import {documentManager} from '../models'
  import type {DocumentType} from '../models/document-model'
  import {currentPatient} from '../services/store'

  let docs:Array<DocumentType>=[]
  currentPatient.subscribe(async p=>{
    const result=await documentManager.getForPatient(p)
    docs=result
  })
</script>

<template>
  {#each docs as doc}
    {JSON.stringify(doc)}
  {/each}
</template>