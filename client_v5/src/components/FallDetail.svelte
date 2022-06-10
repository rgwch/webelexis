<script lang="ts">
import { CaseManager, FormDefinition } from "../models/case-model";
import type { CaseType } from "../models/case-model";
import { EncounterModel } from "../models/encounter-model";
import type { FlexformConfig } from "../widgets/flexformtypes";
import { _ } from "svelte-i18n";
import Form from "../widgets/Flexform.svelte";
import { Money } from "../models/money";
export let entity: CaseType;
const form: FlexformConfig = FormDefinition;
form.title = $_("case.detail");
const cm = new CaseManager();
let sum: Money = new Money(0);
let unbilled: Money = new Money(0);
cm.getEncounters(entity).then(async (result) => {
  for (const k of result) {
    const em = new EncounterModel(k);
    const sub = await em.getSum();
    sum = sum.add(sub);
    if (!k.rechnungsid) {
      unbilled = unbilled.add(sub);
    }
  }
});
</script>

<template>
  <Form ff_cfg="{form}" entity="{entity}" lockable="{true}" />
  <p>
    Summe: {sum.getFormatted()}, davon unverrechnet: {unbilled.getFormatted()}
  </p>
</template>
