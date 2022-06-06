<script lang="ts">
import { prescriptionManager } from "../models";
import type { PatientType } from "../models/patient-model";
import type {
  PrescriptionType,
  MEDICATIONDEF,
} from "../models/prescription-model";
import Medicationlist from "./Medicationlist.svelte";
export let entity: PatientType;

let medication: MEDICATIONDEF = {
  fix: [],
  symptom: [],
  reserve: [],
  rezeptdefs: [],
};
prescriptionManager.fetchCurrent(entity?.id).then((result) => {
  medication = result;
});
</script>

<template>
  <div class="flex flex-row">
    <div class="m-3 p-2 flex-1">
      <p>Fixmedikation</p>
      <Medicationlist bind:list="{medication.fix}" />
    </div>
    <div class="m-3 p-2 flex-1">
      <p>Bedarfsmedikation</p>
      <Medicationlist bind:list="{medication.reserve}" />
    </div>
    <div class="m-3 p-2 flex-1">
      <p>Alle Medikamente</p>
      <Medicationlist bind:list="{medication.symptom}" />
    </div>
  </div>
</template>
