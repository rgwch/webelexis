<script lang="ts">
  import { patientManager, type PatientType } from "../models/patient-model";
  import { _ } from "svelte-i18n";
  import Form, {type FlexformConfig} from "../widgets/Flexform.svelte";
  import KeyValueDisplay from "../widgets/KeyValueDisplay.svelte";
  export let entity: PatientType;
  export let showTitle = true;
  const form: FlexformConfig = patientManager.getDefinition();
  form.compact = false;
  form.title = showTitle ? $_("patient.detail") : "";
  async function save() {
    await patientManager.save(entity);
  }
</script>

<template>
  <Form ff_cfg={form} {entity} lockable={true} on:save={save} />
  <h2>Extinfo</h2>
  <KeyValueDisplay obj={entity.extjson} />
</template>
