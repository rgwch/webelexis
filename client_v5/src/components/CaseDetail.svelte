<script lang="ts">
import type { CaseType } from "../models/case-model";
import { FormDefinition as form } from "../models/case-model";
import Form from "../widgets/Flexform.svelte";
export let entity: CaseType;
</script>

<template>
  <Form ff_cfg="{form}" entity="{entity}" />
</template>
