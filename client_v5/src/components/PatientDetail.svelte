<script lang="ts">
import { Patient, PatientManager, type PatientType } from "../models/patient-model";
import type { FlexformConfig } from "../widgets/flexformtypes";
import { _ } from "svelte-i18n";
import Form from "../widgets/Flexform.svelte";
export let entity:PatientType;
export let showTitle=true
const form: FlexformConfig = Patient.getDefinition();
const pm=new PatientManager()
form.compact = false;
form.title = showTitle ? $_("patient.detail") : "";
async function save(){
  await pm.save(entity)
}
</script>

<template>
  <Form ff_cfg="{form}" entity="{entity}" lockable="{true}" on:save="{save}" />
</template>
