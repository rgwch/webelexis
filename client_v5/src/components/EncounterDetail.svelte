<script lang="ts">
import { EncounterModel } from "../models/encounter-model";
import type { FlexformConfig } from "../widgets/flexformtypes";
import { _ } from "svelte-i18n";
import Form from "../widgets/Flexform.svelte";
export let entity;
const form: FlexformConfig = EncounterModel.getDefinition();
form.title = $_("encounter.detail");
</script>

<template>
  <Form ff_cfg="{form}" entity="{entity}" lockable="{true}" />
</template>
