<script lang="ts">
  import DatePicker from "../widgets/DatePicker.svelte";
  import { Statics, TerminManager, TerminModel } from "../models/termine-model";
  import type { TerminType } from "../models/termine-model";
  import Appointment from "../components/Appointment.svelte";
  import NewAppointment from "../components/Newappointment.svelte";
  import { currentPatient } from "../services/store";
  import { navigate } from "svelte-navigator";
  import { _ } from "svelte-i18n";
  import Dropdown from "../widgets/Dropdown.svelte";
  import {
    agendaDate,
    agendaResource,
    agendaResources,
  } from "../services/store";
  const tm = new TerminManager();

  let list: Array<TerminModel> = [];

  $: tm.fetchForDay($agendaDate, $agendaResource).then((result) => {
    list = result;
  });

  function extend(event) {
    const termin: TerminModel = event.detail;
    let idx = list.findIndex((t) => t.obj.id === termin.obj.id);
    if (idx > -1) {
      while (++idx < list.length) {
        if (!list[idx].isFree()) {
          const et = list[idx].getStartTime();
          termin.setEndTime(et);
          tm.save(termin);
          list = tm.buildAppointmentList(list.filter((t) => !t.isFree()));
          break;
        }
      }
    }
  }
  function shrink(event) {
    const termin: TerminModel = event.detail;
    termin.setDuration(Math.round(termin.getDuration() / 2));
    tm.save(termin);
    list = tm.buildAppointmentList(list.filter((t) => !t.isFree()));
  }
  function remove(event) {
    const termin: TerminModel = event.detail;
    let idx = list.findIndex((t) => t.obj.id === termin.obj.id);
    if (idx > -1) {
      list.splice(idx, 1);
      tm.delete(termin);
      list = tm.buildAppointmentList(list.filter((t) => !t.isFree()));
    }
  }
  function pselect(event) {
    const termin: TerminModel = event.detail;
    termin.getKontakt().then((pat) => {
      currentPatient.set(pat);
      navigate("emr");
    });
  }
  function select() {}
</script>

<template>
  <div class="flex flex-col md:flex-row">
    <div>
      <DatePicker
        on:select={(event) => {
          $agendaDate = event.detail;
        }}
        keepOpen={true}
      />
      <Dropdown
        on:changed={(event) => {
          $agendaResource = event.detail;
        }}
        elements={$agendaResources}
        selected={$agendaResource}
      />
    </div>
    <div class="flex-auto">
      <ul>
        {#if list}
          {#each list as termin}
            <li
              style="background-color:{termin.getStateColor()};list-style-type:none"
            >
              {#if termin.isFree()}
                <NewAppointment {termin} on:reload={()=>{$agendaDate=$agendaDate}} />
              {:else}
                <Appointment
                  {termin}
                  on:pselect={pselect}
                  on:extend={extend}
                  on:shrink={shrink}
                  on:delete={remove}
                />
              {/if}
            </li>
          {/each}
        {/if}
      </ul>
    </div>
  </div>
</template>
