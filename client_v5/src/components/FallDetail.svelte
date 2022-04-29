<script lang="ts">
import { CaseModel } from "../models/case-model";
import type { FlexformConfig } from "../widgets/Flexform.svelte";
import Form from "../widgets/Flexform.svelte";
export let entity;
const form: FlexformConfig = CaseModel.getDefinition();
</script>

<template>
  <Form ff_cfg="{form}" entity="{entity}" />
</template>
