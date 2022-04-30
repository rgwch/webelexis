<script lang="ts">
import { Patient } from "../models/patient-model";
import type { FlexformConfig } from "../widgets/flexformtypes";
import { _ } from "svelte-i18n";
import Form from "../widgets/Flexform.svelte";
export let entity;
const form: FlexformConfig = Patient.getDefinition();
form.compact = false;
form.title = $_("patient.detail");
</script>

<template>
  <Form ff_cfg="{form}" entity="{entity}" lockable="{true}" />
</template>
