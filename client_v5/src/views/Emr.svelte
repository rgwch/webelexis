<script lang="ts">
import { Tabs, Tab, TabList, TabPanel } from "svelte-tabs";
import { _ } from "svelte-i18n";
import { currentPatient } from "../services/store";
import { Patient } from "../models/patient-model";
import PatientSelector from "../components/PatientSelector.svelte";
import PatientDetail from "../components/PatientDetail.svelte";
import Encounters from "../components/Encounters.svelte";
import Cases from "../components/Cases.svelte";
import Prescriptions from "../components/Prescriptions.svelte";
import Documents from "./Documents.svelte";
import Findings from "../components/Findings.svelte";

let selector = false;

function selected() {
  selector = false;
}
</script>

<template>
  <!-- p class="testclass">
    Test - should be blue on red if windi.css is configured correctly
  </p -->
  <p
    class="font-bold text-blue-700 cursor-pointer"
    on:click="{() => (selector = !selector)}">
    {@html Patient.getLabel($currentPatient)}
  </p>
  {#if selector}
    <PatientSelector on:selected="{selected}" />
  {/if}
  {#if $currentPatient}
    <Tabs>
      <TabList>
        <Tab>{$_("titles.personalia")}</Tab>
        <Tab>{$_("titles.encounters")}</Tab>
        <Tab>{$_("titles.cases")}</Tab>
        <Tab>{$_("titles.medicaments")}</Tab>
        <Tab>{$_("titles.findings")}</Tab>
        <Tab>{$_("titles.documents")}</Tab>
      </TabList>

      <TabPanel>
        <PatientDetail entity="{$currentPatient}" showTitle="{false}" />
      </TabPanel>

      <TabPanel>
        <Encounters />
      </TabPanel>
      <TabPanel>
        <Cases />
      </TabPanel>
      <TabPanel>
        <Prescriptions />
      </TabPanel>
      <TabPanel>
        <Findings />
      </TabPanel>
      <TabPanel>
        <Documents />
      </TabPanel>
    </Tabs>
  {/if}
</template>
