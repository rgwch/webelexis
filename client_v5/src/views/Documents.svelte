<script lang="ts">
import { currentPatient } from "../services/store";
import { Tabs, Tab, TabList, TabPanel } from "svelte-tabs";
import Outgoing from '../components/OutgoingDocs.svelte'
import { _ } from "svelte-i18n";
</script>
<template>
  {#if $currentPatient}
    <Tabs>
      <TabList>
        <Tab>{$_("titles.incoming")}</Tab>
        <Tab>{$_("titles.outgoing")}</Tab>

      </TabList>
      <TabPanel>
        <p>Incoming</p>
      </TabPanel>
      <TabPanel>
        <Outgoing></Outgoing>
      </TabPanel>
    </Tabs>
  {/if}
</template>