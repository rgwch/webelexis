<script lang="ts">
import { EncounterModel, type EncounterType } from "../models/encounter-model";
import type { FlexformConfig } from "../widgets/flexformtypes";
import { _ } from "svelte-i18n";
import Form from "../widgets/Flexform.svelte";
import type { Money } from "../models/money";
export let entity:EncounterType;
const form: FlexformConfig = EncounterModel.getDefinition();
form.title = $_("encounter.detail");
let sum: Money;
let entry: string
const kons=new EncounterModel(entity)
kons.getSum().then((s) => (sum = s));
kons.getKonsText().then(result=>entry=result.html)
</script>

<template>
  <Form ff_cfg="{form}" entity="{entity}" lockable="{true}" />
  <p>{$_("encounter.billed")}: {sum?.getFormatted()}</p>
  <p>{@html entry}</p>
</template>
