<script lang="ts">
import Collapse from "../widgets/Collapse.svelte";
import { _ } from "svelte-i18n";
import { currentPatient } from "../main";
import { Patient } from "../models/patient-model";
import PatientSelector from "../components/PatientSelector.svelte";
import PatientDetail from "../components/PatientDetail.svelte";
import Encounters from "../components/Encounters.svelte";

let persdata = false;
let medicaments = false;
let encounters = false;
let selector = false;

function selected(){
  selector=false;
  medicaments=false;
  encounters=false;
  persdata=false;
}
</script>

<template>
  <p
    class="font-bold text-blue-700 cursor-pointer"
    on:click="{() => (selector = !selector)}">
    {@html Patient.getLabel($currentPatient)}
  </p>
  {#if selector}
    <PatientSelector on:selected={selected}/>
  {/if}
  <Collapse title="{$_('titles.personalia')}" bind:open="{persdata}">
    <div slot="body">
      <PatientDetail entity="{$currentPatient}" />
    </div>
  </Collapse>
  <Collapse title="{$_('titles.encounters')}" bind:open="{encounters}">
    <div slot="body">
      <Encounters entity="{$currentPatient}" />
    </div>
  </Collapse>
  <Collapse title="{$_('titles.medicaments')}" bind:open="{medicaments}">
    <div slot="body">No contents yet</div>
  </Collapse>
</template>
