<script lang="ts">
import { Tabs, Tab, TabList, TabPanel } from "svelte-tabs";
import { _ } from "svelte-i18n";
import {currentPatient} from "../services/store";
import { Patient, PatientManager, type PatientType } from "../models/patient-model";
import PatientSelector from "../components/PatientSelector.svelte";
import PatientDetail from "../components/PatientDetail.svelte";
import Encounters from "../components/Encounters.svelte";
import Cases from '../components/Cases.svelte'

let selector = false;

function selected() {
  selector = false;
}
</script>

<template>
  <p class="testclass">A Test</p>
  <p
    class="font-bold text-blue-700 cursor-pointer"
    on:click="{() => (selector = !selector)}">
    {@html Patient.getLabel($currentPatient)}
  </p>
  {#if selector}
    <PatientSelector on:selected="{selected}" />
  {/if}
  <Tabs>
    <TabList>
      <Tab>{$_("titles.personalia")}</Tab>
      <Tab>{$_("titles.encounters")}</Tab>
      <Tab>{$_("titles.cases")}</Tab>
      <Tab>{$_("titles.medicaments")}</Tab>
      <Tab>{$_("titles.documents")}</Tab>
    </TabList>

    <TabPanel>
      <PatientDetail entity="{$currentPatient}" showTitle="{false}" />
    </TabPanel>

    <TabPanel>
      <Encounters entity="{$currentPatient}" />
    </TabPanel>
    <TabPanel>
      <Cases entity="{$currentPatient}" />
    </TabPanel>
    <TabPanel>
      <p>No contents yet</p>
    </TabPanel>
    <TabPanel>
      <p>No contents yet</p>
    </TabPanel>
  </Tabs>
</template>
