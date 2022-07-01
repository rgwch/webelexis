<script lang="ts">
import { getService } from "../services/io";
import { labresultManager } from "../models";
import { currentPatient } from "../services/store";
import { each } from "svelte/internal";
import type { LABRESULTS } from "../models/labresult-model";
import Collapse from "../widgets/Collapse.svelte";
import Labitem from "./Labitem.svelte";
import { faSort } from "@fortawesome/free-solid-svg-icons";
let labresults: LABRESULTS = { dates: [], items: {} };
let groups: Array<string> = [];
labresultManager.fetchForPatient($currentPatient?.id).then((result) => {
  labresults = result;
  groups = Object.keys(result.items).sort((a, b) => a.localeCompare(b));
});

</script>

<template>
  {#each groups as group}
    <Collapse title="{group}">
      <div slot="body">
        {#each Object.keys(labresults.items[group]).sort((a,b)=>parseFloat(labresults.items[group][a][0].prio)-parseFloat(labresults.items[group][b][0].prio)) as item}
          <Labitem items="{labresults.items[group][item]}" />
        {/each}
      </div>
    </Collapse>
  {/each}
</template>
