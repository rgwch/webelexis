<script lang="ts">
import { EncounterModel, type EncounterType } from "../models/encounter-model";
import Editor from '../widgets/Editor.svelte'
import {Macros} from '../services/macros'
import type { FlexformConfig } from "../widgets/flexformtypes";
import { _ } from "svelte-i18n";
import Form from "../widgets/Flexform.svelte";
import type { Money } from "../models/money";
export let entity:EncounterType;
export let showTitle=true
const form: FlexformConfig = EncounterModel.getDefinition();
form.title = showTitle ? $_("encounter.detail") : "";
let sum: Money;
let entry: string
const kons=new EncounterModel(entity)
kons.getSum().then((s) => (sum = s));
// kons.getKonsText().then(result=>entry=result.html)
const text=kons.getKonsText()
function changed(event){
  kons.setKonsText(event.detail)
}

async function saveEncounter(){
  console.log("Save event")
  await kons.save()
}
let locked=false
</script>

<template>
  <Form
    ff_cfg="{form}"
    entity="{entity}"
    lockable="{true}"
    on:lock="{(event) => {
      console.log("Lock received")
      locked = event.detail;
    }}"
    on:save="{saveEncounter}" />
  <p>{$_("encounter.billed")}: {sum?.getFormatted()}</p>
  {#await text}
    <p>wait</p>
  {:then result}
    <Editor
      contents="{result.json || result.html}"
      extensions="{[Macros]}"
      on:changed="{changed}"
      editable="{!locked}" />
  {/await}
</template>
