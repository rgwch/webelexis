<script lang="ts">
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import type { FindingType } from "../models/findings-model";
import type { FindingsModel } from "../models/findings-model";
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

/**
 * Display a single Finding type and allow to add, select, delete and display measrurements
 */
export let finding: FindingsModel;
let isOpen: boolean = false;
let doAddMeasurement: boolean = false;
let values = {};
let newdate = util.DateToElexisDate(new Date());

function displayLine(row) {
  const def = finding.def; // definitions[finding.getName()];
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
    for (const el of finding.getElements()) {
      r.push(values[el.title]);
    }
    finding.addMeasurement(r, newdate);
    try {
      const updated = await findingsManager.saveFinding(finding);
    } catch (err) {
      alert(err);
    }
  }
}
/**
 * Menuoption: select all measurements
 */
function selectAll() {
  for (const m of finding.getMeasurements()) {
    m["selected"] = true;
  }
}
/**
 * Menuoption: Unselect all measurments
 */
function deselectAll() {
  for (const m of finding.getMeasurements()) {
    m["selected"] = false;
  }
}

function getDisabled() {
  if (finding && finding.getMeasurements().some((m) => m["selected"])) {
    return "";
  } else {
    return "disabled";
  }
}
/**
 * Menuoption: Delete selected meaurements (after confirmation)
 */
async function remove() {
  if (finding.f.measurements.some((m) => m["selected"])) {
    for (const m of finding.f.measurements) {
      if (m["selected"]) {
        const ask = $_("prompts.reallydelete", {
          values: { item: util.ElexisDateToLocalDate(m.datetime) },
        });
        if (confirm(ask)) {
          finding.removeMeasurement(m.datetime);
          await findingsManager.saveFinding(finding);
        }
      }
    }
  }
}

/**
 * create a chart of selected elements. If no element are selected, select all.
 */
function chart() {
  if (!finding.f.measurements.some((m) => m["selected"])) {
    for (const m of finding.f.measurements) {
      m["selected"] = true;
    }
  }
  // dgs.open({ viewModel: DisplayChart, model: finding })
}

/**
 * React on update of finding-objects (Message from the service):
 * if it's "our" finding, update the list.
 */
const checkUpdate = (updated) => {
  //console.log(JSON.stringify(updated))
  //console.log(JSON.stringify(finding))
  if (finding && finding.f.id) {
    if (updated.id === finding.f.id) {
      finding.f.measurements = updated.measurements;
    }
  } else {
    if (finding && finding.f.name) {
      if (finding.f.name == updated.name) {
        updated.title = finding.getTitle();
        finding = updated;
      }
    }
  }
};

const menuItems = [
  $_("actions.add"),
  $_("actions.selectall"),
  $_("actions.selectnone"),
  // $_("actions.graph"),
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
    case $_("actions.delete"):
      remove();
      break;
  }
}
</script>

<template>
  <Collapse bind:open="{isOpen}">
    <div slot="header" class="flex">
      <span>{finding.getTitle()}</span>
      <Badge text="{finding.getMeasurements().length.toString()}" />
      {#if isOpen}
        <span>
          <Popup items="{menuItems}" on:selected="{menuselect}" />
        </span>
      {/if}
    </div>

    <div slot="body">
      <ul>
        {#each finding.getMeasurements() as m}
          <li class="list-group-item">
            <input type="checkbox" bind:checked="{m.selected}" />
            <span style="font-size:smaller;font-weight:bolder"
              >{util.ElexisDateToLocalDate(m.datetime)}</span>
            {displayLine(m.values)}
          </li>
        {/each}
      </ul>
    </div>
  </Collapse>
  {#if doAddMeasurement}
    <Modal
      title="{finding.getTitle()}"
      dismiss="{() => {
        doAddMeasurement = false;
      }}"
      on:closed="{enterValues}">
      <div slot="body">
        <DateInput dateString="{newdate}" />
        {#each finding.getElements() as el}
          {#if el.manual == true}
            <LineInput
              bind:value="{values[el.title]}"
              label="{el.title}"
              placeholder="{el.unit}" />
          {/if}
        {/each}
      </div>
    </Modal>
  {/if}
</template>
