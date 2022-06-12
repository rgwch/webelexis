<script lang="ts">
import { currentPatient } from "../services/store";
import { Tabs, Tab, TabList, TabPanel } from "svelte-tabs";
import Outgoing from "../components/OutgoingDocs.svelte";
import Incoming from "../components/IncomingDocs.svelte";
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
        <Incoming />
      </TabPanel>
      <TabPanel>
        <Outgoing />
      </TabPanel>
    </Tabs>
  {/if}
</template>
