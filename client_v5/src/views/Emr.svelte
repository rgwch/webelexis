<script lang="ts">
import Collapse from "../widgets/Collapse.svelte";
import { _ } from "svelte-i18n";
import {currentPatient} from '../main'
import PatientSelector from '../components/PatientSelector.svelte'
import PatientDetail from '../components/PatientDetail.svelte'
import Encounters from '../components/Encounters.svelte'

let persdata=false;
let medicaments=false
let encounters=false
</script>

<template>
  <PatientSelector></PatientSelector>
  <Collapse title={$_('titles.personalia')} bind:open={persdata}>
    <div slot="body">
      <PatientDetail entity={$currentPatient}></PatientDetail>
    </div>
  </Collapse>
  <Collapse title={$_('titles.encounters')} bind:open={encounters}>
    <div slot="body">
      <Encounters></Encounters></div>
  </Collapse>
  <Collapse title={$_('titles.medicaments')} bind:open={medicaments}>
    <div slot="body">No contents yet</div>
  </Collapse>
</template>
