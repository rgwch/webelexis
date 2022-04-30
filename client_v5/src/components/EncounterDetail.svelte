<script lang="ts">
import { EncounterModel } from "../models/encounter-model";
import type { FlexformConfig } from "../widgets/flexformtypes";
import { _ } from "svelte-i18n";
import Form from "../widgets/Flexform.svelte";
import type { Money } from "../models/money";
export let entity;
const form: FlexformConfig = EncounterModel.getDefinition();
form.title = $_("encounter.detail");
let sum: Money;
new EncounterModel(entity).getSum().then((s) => (sum = s));
</script>

<template>
  <Form ff_cfg="{form}" entity="{entity}" lockable="{true}" />
  <p>{$_("encounter.billed")}: {sum?.getFormatted()}</p>
  <p>{@html entity?.eintrag?.html}</p>
</template>
