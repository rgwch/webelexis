<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Calendar from "./Calendar.svelte";
  import { monthNames } from "../models/timedate";
  import { DateTime } from "luxon";
  import { _ } from "svelte-i18n";
  import "../../node_modules/@fortawesome/fontawesome-free/js/solid";
  import "../../node_modules/@fortawesome/fontawesome-free/js/fontawesome";
  const dispatch = createEventDispatcher();

  /**
   * a function to determine, if a given date should be available for selection. Default: all
   */
  export let isAllowed = (Date) => true;
  /**
   * The date to start (default: today)
   */
  export let current: Date = new Date();
  $: selected = DateTime.fromJSDate(current);
  /**
   *  if the Calendar box should be kept open (otherwise popup)
   * */
  export let keepOpen = false;

  /**
   * Disable inpu if true
   */
  export let disabled = false;

  export let id: string = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, 5);

  let showDatePicker;

  function dateChanged() {
    selected = DateTime.fromJSDate(current);
    toggleCalendar();
    dispatch("select", current);
  }

  // handlers
  const toggleCalendar = () => {
    showDatePicker = !showDatePicker;
  };

  const next_year = () => (current = selected.plus({ years: 1 }).toJSDate()); // new Date(selected.setFullYear(selected.getFullYear() + 1)));
  const prev_year = () => (current = selected.minus({ years: 1 }).toJSDate()); // new Date(selected.setFullYear(selected.getFullYear() - 1)));
  const today = () => {
    current = new Date();
    dateChanged()
  };
  const next_month = () => (current = selected.plus({ months: 1 }).toJSDate()); // new Date(selected.setMonth(selected.getMonth() + 1)));
  const prev_month = () => (current = selected.minus({ months: 1 }).toJSDate()); // new Date(selected.setMonth(selected.getMonth() - 1)));
  
  onMount(()=>{
    setTimeout(()=>dispatch('select',current),200)
    
  })
</script>

<template>
  <div class="relative">
    {#if !keepOpen}
      {#if disabled}
        <span class="btn-disabled">
          {selected.toFormat($_("formatting.date"))}
        </span>
      {:else}
        <button on:click={toggleCalendar} class="btn" {id}>
          {selected.toFormat($_("formatting.date"))}
        </button>
      {/if}
    {/if}
    {#if showDatePicker || keepOpen}
      <div class={keepOpen ? "permanent" : "popup"}>
        <div class="month-name">
          <div class="center">
            <span class="mx-4" on:click={prev_year}>
              <i class="fa fa-backward" />
            </span>
            <span class="mx-4" on:click={prev_month}>
              <i class="fa fa-chevron-left" />
            </span>
            <span on:click={today}>
              <i class="fa fa-calendar-day" />
            </span>
          </div>
          <div class="center">
            {monthNames[selected.month - 1]}
            {selected.year}
          </div>
          <div class="center">
            <span class="mx-4" on:click={next_month}>
              <i class="fa fa-chevron-right" />
            </span>
            <span class="mx-4" on:click={next_year}>
              <i class="fa fa-forward" />
            </span>
          </div>
        </div>
        <Calendar bind:date={current} {isAllowed} on:select={dateChanged} />
      </div>
    {/if}
  </div>
</template>

<style>
  .relative {
    position: relative;
  }
  .permanent {
    width: 370px;
  }
  .popup {
    position: absolute;
    top: 1.5em;
    left: 0px;
    border: 1px solid green;
    display: inline-block;
    background: green;
  }

  .month-name {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 6px 0;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
