<script lang="ts">
  import {StockManager, type StockEntryType} from '../models/stock-model'
  import type { FlexformConfig } from "../widgets/flexformtypes";
  import Form from "../widgets/Flexform.svelte";
  export let entity:StockEntryType
  const form=StockManager.getDefinition()
  const sm=new StockManager();

</script>

<template>
  <Form ff_cfg={form} {entity} />
</template>
