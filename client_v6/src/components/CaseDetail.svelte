<script lang="ts">
import type { CaseType } from "../models/case-model";
import { FormDefinition as form } from "../models/case-model";
import { currentCase } from "../services/store";
import Form from "../widgets/Flexform.svelte";

</script>

<template>
  <Form ff_cfg="{form}" entity="{$currentCase}" />
</template>
