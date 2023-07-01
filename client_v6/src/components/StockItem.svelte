<script lang="ts">
  import {StockManager, type StockEntryType} from '../models/stock-model'
  import type { FlexformConfig } from "../widgets/flexformtypes";
  import {_} from 'svelte-i18n'
  import Form from "../widgets/Flexform.svelte";
  export let entity:StockEntryType
  const form=StockManager.getDefinition()
  const sm=new StockManager();
  function count(num){
    entity.current+=num
  }
  function del(){
    if(confirm($_("prompts.reallydelete",{values: {item: entity._Title}}))){
      sm.remove(entity)
    }
  }
</script>

<template>
  <Form ff_cfg={form} {entity} />
  {#if entity}
    <div class="flex">
      <button class="roundbutton mx-2 mt-2" on:click={() => count(1)}
        >{$_("medication.instock")}</button
      >
      <button class="roundbutton mx-2 mt-2" on:click={() => count(-1)}
        >{$_("medication.outstock")}</button
      >
    </div>
    <div class="my-5 py-5">
      <button class="roundbutton mx-2" on:click={del}
        >{$_("medication.remove")}</button
      >
    </div>
  {/if}
</template>
