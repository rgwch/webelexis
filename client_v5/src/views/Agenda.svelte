<script lang="ts">
import DatePicker from "../widgets/DatePicker.svelte";
import { TerminManager, TerminModel } from "../models/termine-model";
import type { TerminType } from "../models/termine-model";
import Appointment from "../components/Appointment.svelte";
import { _ } from "svelte-i18n";
const tm = new TerminManager();

let list: Array<TerminModel> = [];
function select(event) {
  const date = event.detail;
  tm.fetchForDay(date, "gerry").then((result) => {
    list = result;
  });
}
function extend(event) {
  const termin: TerminModel = event.detail;
  let idx = list.findIndex((t) => t.obj.id === termin.obj.id);
  if (idx > -1) {
    while (++idx < list.length) {
      if (!list[idx].isFree()) {
        const et = list[idx].getStartTime();
        termin.setEndTime(et);
        tm.save(termin);
        list=tm.buildAppointmentList(list)
        break;
      }
    }
  }
}
</script>

<template>
  <div class="flex">
    <DatePicker on:select="{select}" keepOpen="{true}" />
    <div class="flex-auto">
      <ul>
        {#each list as termin}
          <li
            style="background-color:{termin.getStateColor()};list-style-type:none">
            <Appointment termin="{termin}" on:extend="{extend}" />
          </li>
        {/each}
      </ul>
    </div>
  </div>
</template>
