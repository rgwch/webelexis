<script lang="ts">
import { prescriptionManager } from "../models";
import type { PatientType } from "../models/patient-model";
import type { PrescriptionType,MEDICATIONDEF } from "../models/prescription-model";
import Medicationlist from "./Medicationlist.svelte";
export let entity:PatientType

let medication:MEDICATIONDEF={fix:[]}
prescriptionManager.fetchCurrent(entity?.id).then(result=>{
  medication=result
})
</script>

<template>
  <Medicationlist bind:list="{medication.fix}" />
</template>
