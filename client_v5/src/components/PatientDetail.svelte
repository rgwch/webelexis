<script lang="ts">
import { Patient } from "../models/patient-model";
import type { FlexformConfig } from "../widgets/flexformtypes";
import Form from "../widgets/Flexform.svelte";
export let entity;
const form: FlexformConfig = Patient.getDefinition();
form.compact = false;
</script>

<template>
  <Form ff_cfg="{form}" entity="{entity}" />
</template>
