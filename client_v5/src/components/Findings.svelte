<script lang="ts">
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { FindingsManager, FindingsModel } from "../models/findings-model";
import Dropdown from '../widgets/Dropdown.svelte'
import Card from '../widgets/Card.svelte'
import {_} from 'svelte-i18n'
import {DateTime} from 'luxon'

/**
 * Display a single Finding type and allow to add, select, delete and display measrurements
 */
//@useView(PLATFORM.moduleName('components/workflow/finding-view.pug'))
  export let finding: {
    name: string
    title: string
    id: string
    measurements: Array<{
      date: Date,
      values: Array<number | string>
    }>
  }

  let isOpen: boolean = false
  let definitions

  
  function displayLine(row) {
    const def = this.definitions[this.finding.name]
    if (def && def.compact) {
      return def.compact(row)
    } else if (def.verbose) {
      return def.verbose(row)
    } else {
      return row
    }
  }
  
  /**
   * Menuoption: Add Measurement
   */
  function addItem() {
    this.fm.fetch(this.finding.name, null).then(item => {
      if (item) {
        this.dgs.open({ viewModel: AddFinding, model: item }).whenClosed(result => {
          if (!result.wasCancelled) {
            this.fm.saveFinding(result.output)
          }
        })
      }
    })
  }
  /**
   * Menuoption: select all measurements
   */
  function selectAll() {
    for (const m of this.finding.measurements) {
      m['selected'] = true
    }
  }
  /**
   * Menuoption: Unselect all measurments
   */
  function deselectAll() {
    for (const m of this.finding.measurements) {
      m['selected'] = false
    }
  }

  function getDisabled() {
    if (this.finding && this.finding.measurements.some(m => m['selected'])) {
      return ""
    } else {
      return "disabled"
    }
  }
  /**
   * Menuoption: Delete selected meaurements (after confirmation)
   */
  async function remove() {
    if (this.finding.measurements.some(m => m['selected'])) {
      for (const m of this.finding.measurements) {
        if (m['selected']) {
          const ask = this.i18.tr('dlg.reallydelete', { item: moment(m.date).format("DD.MM.YYYY") })
          if (confirm(ask)) {
            await this.fm.removeFinding(this.finding.id, m.date)
          }
        }
      }
    }
  }

  /**
   * create a chart of selected elements. If no element are selected, select all.
   */
  function chart() {
    if (!this.finding.measurements.some(m => m['selected'])) {
      for (const m of this.finding.measurements) {
        m['selected'] = true
      }
    }
    // this.dgs.open({ viewModel: DisplayChart, model: this.finding })

  }
  /**
   * Open and close display of measurements of a category
   */
  function toggle() {
    this.isOpen = !this.isOpen
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
        this.finding.measurements = updated.measurements
      }
    }else{
      if(this.finding && this.finding.name){
        if(this.finding.name==updated.name){
          updated.title=this.finding.title
          this.finding=updated
        }
      }
    }
  }

  const menuItems=[
    $_('actions.add'),
    $_('actions.selectall'),
    $_('actions.selectnone'),
    $_('actions.graph'),
    $_('actions.export'),
    $_('actions.delete')
  ]

</script>
<template>
  <Card>
    <div slot="heading">
      <Dropdown label={finding.title} elements={menuItems} bind:selected={isOpen}></Dropdown>
    </div>
    <div slot="body">

    </div>
  </Card>
  <div class="card">
    <div class="card-header bg-light">
      <span on:click="{toggle}">${finding.title}
        <span class="badge badge-dark">${finding.measurements.length}</span>
      </span>
      <!-- Menu -->
      <div class="nav" style="position:absolute;right:20px;top:5px;">
        <div class="dropdown" if.bind="isOpen">
          <a data-toggle="dropdown" href="#" role="button">
            <i class="fas fa-bars"></i>
          </a>
          <ul class="dropdown-menu" role="menu">
            <li class="dropdown-item menuitem" click.delegate="addItem()" t="menu.add" />
            <li class="dropdown-item menuitem" click.delegate="selectAll()" t="menu.selectall"></li>
            <li class="dropdown-item menuitem" class.bind="disabled" click.delegate="deselectAll()" disabled t="menu.deselectall"></li>
            <li class="dropdown-divider"></li>
            <li class="dropdown-item menuitem" click.delegate="chart()" t="menu.graph"></li>  
            <li class="dropdown-item menuitem" class.bind="disabled" t="menu.export"></li>  
            <li class="dropdown-divider"></li>
            <li class="dropdown-item menuitem" class.bind="disabled" click.delegate="delete()" t="menu.delete"></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="card-body" if.bind="isOpen">
      <ul class="list-group">
        <li class="list-group-item" repeat.for="m of finding.measurements">
          <input type="checkbox" checked.bind="m.selected">
          <span style="font-size:smaller;font-weight:bolder">${m.date}</span>
          ${displayLine(m.values)}</li>
      </ul>
    </div>
  </div>
</template>
