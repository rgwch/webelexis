<script lang="ts">
  import { Patient, PatientManager } from "../models/patient-model";
  import type { FlexformConfig } from "../widgets/flexformtypes";
  import type { PatientType } from "../models/patient-model";
  import { _ } from "svelte-i18n";
  import Form from "../widgets/Flexform.svelte";
  import KeyValueDisplay from "../widgets/KeyValueDisplay.svelte";
  export let entity: PatientType;
  export let showTitle = true;
  const form: FlexformConfig = Patient.getDefinition();
  const pm = new PatientManager();
  form.compact = false;
  form.title = showTitle ? $_("patient.detail") : "";
  async function save() {
    await pm.save(entity);
  }
</script>

<template>
  <Form ff_cfg={form} {entity} lockable={true} on:save={save} />
  <h2>Extinfo</h2>
  <KeyValueDisplay obj={entity.extjson} />
</template>
