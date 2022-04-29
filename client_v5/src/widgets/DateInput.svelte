<script lang="ts">
import DatePicker from "./DatePicker.svelte";
import { DateTime } from "luxon";
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();

/**
 * Predefined value. Should be a Javascript-Date compliant formatted string
 */
export let dateString: string = "19810309";
let current: Date = DateTime.fromISO(dateString).toJSDate();
/**
 * Optional label
 */
export let label: string = "";

export let id: string = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, "")
  .substring(0, 5);
/**
 * Disable input
 */
export let disabled: boolean = false;
function changed() {
  const ndate = DateTime.fromJSDate(current).toFormat("yyyyLLdd");
  //console.log('date changed from ',dateString," to ", ndate);
  dateString = ndate;
  dispatch("dateChanged");
}
</script>

<!-- @component DateInput
A label and a DatePicker
-->
<template>
  <div class="formfield flex flex-col">
    {#if label}
      <label for="{id}" class="text-sm font-bold">{label}</label>
    {/if}
    <DatePicker
      current="{current}"
      on:select="{changed}"
      id="{id}"
      disabled="{disabled}"
    />
  </div>
</template>

<style>
</style>
