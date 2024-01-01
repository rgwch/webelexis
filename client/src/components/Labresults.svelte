<script lang="ts">
  import { getService } from "../services/io";
  import { labresultManager } from "../models";
  import type { LabresultType } from "../models/labresult-model";
  import { currentPatient } from "../services/store";
  import type { LABRESULTS } from "../models/labresult-model";
  import Collapse from "../widgets/Collapse.svelte";
  import Labitem from "./Labitem.svelte";
  import utils from "../services/util";
  let labresults: LABRESULTS = { dates: [], items: {} };
  let groups: Array<string> = [];
  let display = "groups";
  labresultManager.fetchAllForPatient($currentPatient?.id).then((result) => {
    labresults = result;
    groups = Object.keys(result.items).sort((a, b) => a.localeCompare(b));
  });
  function labRow(items: Array<LabresultType>) {
    let ret = "";
    for (const d of labresults.dates) {
      const res = items.find((it) => it.datum === d);
      if (res) {
        ret += "<td>" + res.resultat + "</td>";
      } else {
        ret += "<td></td>";
      }
    }
    return ret;
  }
</script>

<template>
  <label><input type="radio" bind:group={display} value={"list"} />Liste</label>
  <label
    ><input
      type="radio"
      bind:group={display}
      value={"groups"}
    />gruppiert</label
  >
  <label
    ><input type="radio" bind:group={display} value={"time"} />Zeitleiste</label
  >
  {#if display === "groups"}
    {#each groups as group}
      <Collapse title={group}>
        <div slot="body">
          {#each Object.keys(labresults.items[group]).sort((a, b) => parseFloat(labresults.items[group][a][0].prio) - parseFloat(labresults.items[group][b][0].prio)) as item}
            <Labitem items={labresults.items[group][item]} />
          {/each}
        </div>
      </Collapse>
    {/each}
  {:else if display === "list"}
    {#each groups as group}
      {#each Object.keys(labresults.items[group]).sort((a, b) => parseFloat(labresults.items[group][a][0].prio) - parseFloat(labresults.items[group][b][0].prio)) as item}
        <Labitem items={labresults.items[group][item]} />
      {/each}
    {/each}
  {:else}
    <div>
      <table style="border: 1px solid">
        <thead>
          <th>Parameter</th>
          {#each labresults.dates as date}
            <th class="px-2">{utils.ElexisDateToLocalDate(date)}</th>
          {/each}
        </thead>
        <tbody>
          {#each groups as group}
            {#each Object.keys(labresults.items[group]).sort((a, b) => parseFloat(labresults.items[group][a][0].prio) - parseFloat(labresults.items[group][b][0].prio)) as item}
              <tr>
                <td class="small"
                  >{labresults.items[group][item][0].titel}&nbsp;
                  {labresults.items[group][item][0].unit}&nbsp;({labresults
                    .items[group][item][0].reference})</td
                >
                {@html labRow(labresults.items[group][item])}
                <!-- Labitem items="{labresults.items[group][item]}" / -->
              </tr>
            {/each}
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</template>

<style>
  tr:nth-child(even) {
    background-color: lightgrey;
  }
  tr:hover {
    background-color: darkgrey;
  }
  .small {
    font-size: smaller;
    font-weight: bolder;
    width: 40em;
  }
</style>
