<!-- 
  EMR Component with subcomponents for all EMR-related stuff.
  We load the subcomponents lazily with {await} to split up the app in smaller chunks
-->
<script lang="ts">
  import {onMount} from 'svelte'
  import { Tabs, Tab, TabList, TabPanel } from "svelte-tabs";
  import { navigate } from "svelte-navigator";
  import { _ } from "svelte-i18n";
  import { currentPatient } from "../services/store";
  import { patientManager } from "../models/patient-model";
  import {StickerManager} from '../models/stickers-model'
  import PatientSelector from "../components/PatientSelector.svelte";
  import PatientDetail from "../components/PatientDetail.svelte";

  import AUF from "../components/AUF.svelte";
  const stm=new StickerManager()
  let selector = false;

  function selected() {
    selector = false;
    navigate("emr");
  }
  
</script>

<template>
  <p
    class="font-bold text-blue-700 cursor-pointer"
    on:click={() => (selector = !selector)}
  >
    {@html patientManager.getLabel($currentPatient)}
  </p>
  {#if selector}
    <PatientSelector on:selected={selected} />
  {/if}
  {#if $currentPatient}
    <Tabs>
      <TabList>
        <Tab>{$_("titles.personalia")}</Tab>
        <Tab>{$_("titles.encounters")}</Tab>
        <Tab>{$_("titles.cases")}</Tab>
        <Tab>{$_("titles.medicaments")}</Tab>
        <Tab>{$_("titles.findings")}</Tab>
        <Tab>{$_("titles.labresults")}</Tab>
        <Tab>{$_("titles.auf")}</Tab>
        <Tab>{$_("titles.documents")}</Tab>
      </TabList>

      <TabPanel>
        <PatientDetail entity={$currentPatient} showTitle={false} />
      </TabPanel>

      <TabPanel>
        {#await import("../components/Encounters.svelte")}
          <p>{$_("general.loading")}</p>
        {:then Encounters}
          <Encounters.default />
        {/await}
      </TabPanel>
      <TabPanel>
        {#await import("../components/Cases.svelte") then Cases}
          <Cases.default />
        {/await}
      </TabPanel>
      <TabPanel>
        {#await import("../components/Prescriptions.svelte")}
          <p>{$_("general.loading")}</p>
        {:then Prescriptions}
          <Prescriptions.default />
        {/await}
      </TabPanel>
      <TabPanel>
        {#await import("../components/Findings.svelte") then Findings}
          <Findings.default />
        {/await}
      </TabPanel>
      <TabPanel>
        {#await import("../components/Labresults.svelte")}
          <p>{$_("general.loading")}</p>
        {:then Labresults}
          <Labresults.default />
        {/await}
      </TabPanel>
      <TabPanel>
        <AUF />
      </TabPanel>
      <TabPanel>
        {#await import("./Documents.svelte")}
          <p>{$_("general.loading")}</p>
        {:then Documents}
          <Documents.default />
        {/await}
      </TabPanel>
    </Tabs>
  {/if}
</template>
