<script lang="ts">
import Finding from "./Finding.svelte";
import { currentPatient } from "../services/store";
import { findingsManager } from "../models";
import type { FindingType } from "../models/findings-model";
let findings: Array<FindingType> = [];

async function fetchFindings(){
  const result = await findingsManager.
}
</script>

<template>
  <div class="flex">
    <p>f</p>
  </div>
</template>
