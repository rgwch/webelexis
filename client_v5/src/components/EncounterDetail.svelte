<script lang="ts">
import { EncounterModel } from "../models/encounter-model";
import type { FlexformConfig } from "../widgets/Flexform.svelte";
import Form from "../widgets/Flexform.svelte";
export let entity;
const form: FlexformConfig = EncounterModel.getDefinition();
</script>

<template>
  <Form ff_cfg="{form}" entity="{entity}" />
</template>
