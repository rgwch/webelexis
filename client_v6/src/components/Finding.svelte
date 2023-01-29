<script lang="ts">
  /********************************************
   * This file is part of Webelexis           *
   * Copyright (c) 2016-2023 by G. Weirich    *
   * License and Terms see LICENSE            *
   ********************************************/

  import type { FindingType, FindingElement } from "../models/findings-model";
  import Popup from "../widgets/Popup.svelte";
  import Badge from "../widgets/Badge.svelte";
  import Collapse from "../widgets/Collapse.svelte";
  import Modal from "../widgets/Modal.svelte";
  import LineInput from "../widgets/LineInput.svelte";
  import DateInput from "../widgets/DateInput.svelte";
  import { _ } from "svelte-i18n";
  import { findingsManager } from "../models";
  import util from "../services/util";
  import { DateTime } from "luxon";
  import { onMount, onDestroy } from "svelte";
  import Chart,{ChartType, type ChartDefinition} from '../widgets/Chart.svelte'
  import { faFeather } from "@fortawesome/free-solid-svg-icons";

  /**
   * Display a single Finding type and allow to add, select, delete and display measrurements
   */
  export let finding: FindingType;
  let isOpen: boolean = false;
  let doAddMeasurement: boolean = false;
  let doShowChart: boolean = false;
  let chartdef:ChartDefinition
  let values = {};
  let newdate = util.DateToElexisDate(new Date());

  function displayLine(row) {
    const def = findingsManager.getDefinitions()[finding.name]; // finding.def; // definitions[finding.getName()];
    if (def && def.compact) {
      return def.compact(row);
    } else if (def.verbose) {
      return def.verbose(row);
    } else {
      return row;
    }
  }

  async function enterValues(event) {
    if (event.detail == true) {
      let r = [];
      for (const el of findingsManager.getElements(finding)) {
        r.push(values[el.title]);
      }
      const fn = await findingsManager.addMeasurement(
        finding.name,
        finding.patientid,
        r,
        newdate
      );
      values = {};
      newdate = util.DateToElexisDate(new Date());
      // finding=fn
      // finding.measurements = fn.measurements;
    }
  }
  /**
   * Menuoption: select all measurements
   */
  function selectAll() {
    for (const m of finding.measurements) {
      m["selected"] = true;
    }
  }
  /**
   * Menuoption: Unselect all measurments
   */
  function deselectAll() {
    for (const m of finding.measurements) {
      m["selected"] = false;
    }
  }

  function getDisabled() {
    if (finding && finding.measurements.some((m) => m["selected"])) {
      return "";
    } else {
      return "disabled";
    }
  }
  /**
   * Menuoption: Delete selected meaurements (after confirmation)
   */
  async function remove() {
    if (finding.measurements.some((m) => m["selected"])) {
      for (const m of finding.measurements) {
        if (m["selected"]) {
          const ask = $_("prompts.reallydelete", {
            values: { item: util.ElexisDateToLocalDate(m.datetime) },
          });
          if (confirm(ask)) {
            finding = await findingsManager.removeMeasurement(
              finding,
              m.datetime
            );
          }
        }
      }
    }
  }

  /**
   * create a chart of selected elements. If no element are selected, select all.
   */
  function chart() {
   if (!finding.measurements.some((m) => m["selected"])) {
      selectAll();
    }
    const fdef=findingsManager.getDefinition(finding)
    const data=[]
    for(let i=0;i<fdef.elements.length;i++){
      const el=fdef.elements[i]
      if(el.chart !== "none"){
      data.push({
        title: el.title,
        color: el.color,
        axe: el.chart ?? "left",
        values: finding.measurements.map(m=>{
          if(m.selected){
            return [util.ElexisDateToISODate(m.datetime),m.values[i]]
          }
        })
      })
      }
    }
    chartdef={
      data
    }
    doShowChart = true;
    // dgs.open({ viewModel: DisplayChart, model: finding })
  }

  /**
   * React on update of finding-objects (Message from the service):
   * if it's "our" finding, update the list.
   */
  const checkUpdate = (updated) => {
    if (updated?.id === finding.id) {
      finding.measurements = updated.measurements;
    }
  };

  const menuItems = [
    $_("actions.add"),
    $_("actions.selectall"),
    $_("actions.selectnone"),
    $_("actions.graph"),
    // $_("actions.export"),
    $_("actions.delete"),
  ];
  function menuselect(event) {
    switch (event.detail) {
      case $_("actions.add"):
        doAddMeasurement = true;
        break;
      case $_("actions.selectall"):
        selectAll();
        break;
      case $_("actions.selectnone"):
        deselectAll();
        break;
      case $_("actions.graph"):
        chart();
        break;
      case $_("actions.delete"):
        remove();
        break;
    }
  }

  onMount(() => {
    findingsManager.subscribe("updated", checkUpdate);
  });
  onDestroy(() => {
    findingsManager.unsubscribe("updated", checkUpdate);
  });
</script>

<template>
  <Collapse bind:open={isOpen}>
    <div slot="header" class="flex">
      <span>{findingsManager.getTitle(finding)}</span>
      <Badge text={finding.measurements.length.toString()} />
      {#if isOpen}
        <span>
          <Popup items={menuItems} on:selected={menuselect} />
        </span>
      {/if}
    </div>

    <div slot="body">
      <ul class="list-none">
        {#each finding.measurements as m}
          <li>
            <input type="checkbox" bind:checked={m.selected} />
            <span class="text-sm font-semibold"
              >{util.ElexisDateToLocalDate(m.datetime)}</span
            >
            {displayLine(m.values)}
          </li>
        {/each}
      </ul>
    </div>
  </Collapse>
  {#if doAddMeasurement}
    <Modal
      title={findingsManager.getTitle(finding)}
      dismiss={() => {
        doAddMeasurement = false;
      }}
      on:closed={enterValues}
    >
      <div slot="body">
        <DateInput bind:dateString={newdate} />
        {#each findingsManager.getElements(finding) as el}
          {#if el.manual == true}
            <LineInput
              bind:value={values[el.title]}
              label={el.title}
              placeholder={el.unit}
            />
          {/if}
        {/each}
      </div>
    </Modal>
  {/if}
  {#if doShowChart}
    <Modal
      title={findingsManager.getTitle(finding)}
      on:closed={() => {
        doShowChart = false;
      }}
    >
      <div slot="body" class="min-h-400px">
        <Chart definition={chartdef} type={ChartType.LINE} />
      </div>
    </Modal>
  {/if}
</template>
