<script lang="ts">
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import type { FindingType } from "../models/findings-model";
import { FindingsManager, FindingsModel } from "../models/findings-model";
import Popup from "../widgets/Popup.svelte";
import Collapse from "../widgets/Collapse.svelte";
import { _ } from "svelte-i18n";
import { DateTime } from "luxon";

/**
 * Display a single Finding type and allow to add, select, delete and display measrurements
 */
export let finding: FindingType;
let isOpen: string = "";
let definitions;

function displayLine(row) {
  const def = this.definitions[this.finding.name];
  if (def && def.compact) {
    return def.compact(row);
  } else if (def.verbose) {
    return def.verbose(row);
  } else {
    return row;
  }
}

/**
 * Menuoption: Add Measurement
 */
function addItem() {
  this.fm.fetch(this.finding.name, null).then((item) => {
    if (item) {
      /*
        this.dgs.open({ viewModel: AddFinding, model: item }).whenClosed(result => {
          if (!result.wasCancelled) {
            this.fm.saveFinding(result.output)
          }
        })
        */
    }
  });
}
/**
 * Menuoption: select all measurements
 */
function selectAll() {
  for (const m of this.finding.measurements) {
    m["selected"] = true;
  }
}
/**
 * Menuoption: Unselect all measurments
 */
function deselectAll() {
  for (const m of this.finding.measurements) {
    m["selected"] = false;
  }
}

function getDisabled() {
  if (this.finding && this.finding.measurements.some((m) => m["selected"])) {
    return "";
  } else {
    return "disabled";
  }
}
/**
 * Menuoption: Delete selected meaurements (after confirmation)
 */
async function remove() {
  if (this.finding.measurements.some((m) => m["selected"])) {
    for (const m of this.finding.measurements) {
      if (m["selected"]) {
        const ask = $_("prompts.reallydelete", {
          values: { item: DateTime.fromJSDate(m.date).toFormat("dd.LL.yyyy") },
        });
        if (confirm(ask)) {
          await this.fm.removeFinding(this.finding.id, m.date);
        }
      }
    }
  }
}

/**
 * create a chart of selected elements. If no element are selected, select all.
 */
function chart() {
  if (!this.finding.measurements.some((m) => m["selected"])) {
    for (const m of this.finding.measurements) {
      m["selected"] = true;
    }
  }
  // this.dgs.open({ viewModel: DisplayChart, model: this.finding })
}
/**
 * Open and close display of measurements of a category
 */
function toggle() {
  this.isOpen = !this.isOpen;
}
/**
 * React on update of finding-objects (Message from the service):
 * if it's "our" finding, update the list.
 */
const checkUpdate = (updated) => {
  //console.log(JSON.stringify(updated))
  //console.log(JSON.stringify(this.finding))
  if (this.finding && this.finding.id) {
    if (updated.id === this.finding.id) {
      this.finding.measurements = updated.measurements;
    }
  } else {
    if (this.finding && this.finding.name) {
      if (this.finding.name == updated.name) {
        updated.title = this.finding.title;
        this.finding = updated;
      }
    }
  }
};

const menuItems = [
  $_("actions.add"),
  $_("actions.selectall"),
  $_("actions.selectnone"),
  $_("actions.graph"),
  $_("actions.export"),
  $_("actions.delete"),
];
</script>

<template>
  <Collapse>
    <div slot="header" class="flex">
      <span>{finding.title}</span>
      <span class="badge">{finding.measurements.length}</span>
      <Popup items={menuItems}></Popup>
    </div>
    <div slot="body">
      <ul>
      {#each finding.measurements as m}
      <li class="list-group-item">
        <input type="checkbox" bind:checked="{m.selected}" />
        <span style="font-size:smaller;font-weight:bolder">{m.date}</span>
        {displayLine(m.values)}
      </li>
  
      {/each}
    </ul>
    </div>
  </Collapse>
</template>
