<script lang="ts">
import { EncounterModel, type EncounterType } from "../models/encounter-model";
import Editor from '../widgets/Editor.svelte'
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
// kons.getKonsText().then(result=>entry=result.html)
const text=kons.getKonsText()
</script>

<template>
  <Form ff_cfg="{form}" entity="{entity}" lockable="{true}" />
  <p>{$_("encounter.billed")}: {sum?.getFormatted()}</p>
  {#await text}
    <p>wait</p>
  {:then result}
    <Editor contents="{result.html}" />
  {/await}
</template>
