<script lang="ts">
import { CaseModel } from "../models/case-model";
import type { FlexformConfig } from "../widgets/flexformtypes";
import { _ } from "svelte-i18n";
import Form from "../widgets/Flexform.svelte";
export let entity;
const form: FlexformConfig = CaseModel.getDefinition();
form.title = $_("case.detail");
</script>

<template>
  <Form ff_cfg="{form}" entity="{entity}" lockable="{true}" />
</template>
