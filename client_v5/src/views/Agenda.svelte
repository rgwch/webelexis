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
</script>

<template>
  <div class="flex">
    <DatePicker on:select="{select}" keepOpen="{true}" />
    <div class="flex-auto">
      <ul>
        {#each list as termin}
          <li
            style="background-color:{termin.getStateColor()};list-style-type:none"
          >
            <Appointment termin="{termin}" />
          </li>
        {/each}
      </ul>
    </div>
  </div>
</template>
