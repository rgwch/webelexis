<script lang="ts">
  /**
   * A Calendar Component
   * @component
   */
  import { DateTime } from 'luxon'
  import { createEventDispatcher } from 'svelte'
  import { _ } from 'svelte-i18n'

  const dispatch = createEventDispatcher()
  /**
   *  Month for this instance to display
   *  @required
   */
  export let date = new Date()
  /**
   *  function should return true if date is selectable
   */
  export let isAllowed = (d) => true
  // callback is called when user changes date
  // export let dateChanged: (d: Date) => void = (d) => {};

  let cells
  const onChange = (allowed, day) => {
    if (allowed && day) {
      date = new Date(date.setDate(day))
      dispatch('select', date)
    }
  }

  $: {
    cells = getDateRows(date).map((day) => ({
      value: day,
      allowed: isAllowed(date),
    }))
  }

  const monthNames = [
    $_('cal.jan') || 'january',
    $_('cal.feb') || 'february',
    $_('cal.mar') || 'march',
    $_('cal.apr') || 'april',
    $_('cal.mai') || 'may',
    $_('cal.jun') || 'june',
    $_('cal.jul') || 'july',
    $_('cal.aug') || 'august',
    $_('cal.sep') || 'september',
    $_('cal.oct') || 'october',
    $_('cal.nov') || 'november',
    $_('cal.dec') || 'december',
  ]
  const weekDays = [
    $_('cal.mon') || 'monday',
    $_('cal.tue') || 'tuesday',
    $_('cal.wed') || 'wednesday',
    $_('cal.thu') || 'thursday',
    $_('cal.fri') || 'friday',
    $_('cal.sat') || 'saturday',
    $_('cal.sun') || 'sunday',
  ]
  const weekDaysShort = [
    $_('cal.mo') || 'mon',
    $_('cal.tu') || 'tue',
    $_('cal.we') || 'wed',
    $_('cal.th') || 'thu',
    $_('cal.fr') || 'fri',
    $_('cal.sa') || 'sat',
    $_('cal.su') || 'sun',
  ]

  function getDateRows(date: Date) {
    const dt = DateTime.fromJSDate(date)
    const monthIndex = dt.month
    const year = dt.year
    const days = dt.daysInMonth
    const rows = Array.from({ length: 42 }).map(() => [])
    const startIndex = dt.set({ day: 1 }).weekday - 1
    Array.from({ length: days }).forEach((_, i) => {
      const index = startIndex + i
      ;(rows as Array<unknown>)[index] = i + 1
    })
    const filled = rows.map((i) => (Array.isArray(i) ? undefined : i))

    return filled[35] ? filled : filled.slice(0, -7)
  }
</script>

<style>
  .calcontainer {
    margin-top: 8px;
    padding: 6px;
    width: 370px;
  }

  .calrow {
    display: flex;
    margin: 2px 6px;
    flex-wrap: wrap;
  }

  .cell {
    display: inline-block;
    width: 45px;
    height: 30px;
    text-align: center;
    padding: 4px;
    margin: 1px;
  }

  .selected {
    background: #84e791;
  }

  .highlight {
    transition: transform 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .disabled {
    background: #efefef;
    cursor: not-allowed;
    color: #bfbfbf;
  }

  .highlight:hover {
    background: rgb(238, 176, 60);
    color: #fff;
    cursor: pointer;
    transform: scale(1.3);
  }

  .selected.highlight:hover {
    background: green;
  }
</style>

<template>
  <div>
    <p>{DateTime.fromJSDate(date).toLocaleString()}</p>
    <div class="calcontainer">
      <div class="calrow">
        {#each weekDaysShort as weekday}
          <div class="cell">{weekday}</div>
        {/each}
      </div>

      <div class="calrow">
        {#each cells as { allowed, value }}
          <div
            class:cell={true}
            class:highlight={allowed && value}
            class:disabled={!allowed}
            class:selected={date.getDate() == value}
            on:click={() => onChange(allowed, value)}>
            {value || ''}
          </div>
        {/each}
      </div>
    </div>
  </div>
</template>
