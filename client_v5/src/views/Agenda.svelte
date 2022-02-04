<script lang="ts">
  import Calendar from '../components/Calendar.svelte'
  import { getService } from '../services/io'
  import { DateTime } from 'luxon'
  import Listview from '../components/Listview.svelte'
  const agnService = getService('termin')
  let date: Date = new Date()
  let list: Array<any> = []
  function select(event) {
    const date = event.detail
    agnService
      .find({
        query: {
          tag: DateTime.fromJSDate(date).toFormat('yyyyLLdd'),
          deleted: '0',
        },
      })
      .then((result) => {
        list = result.data
      })
  }
</script>

<template>
  <div class="flex">
    <Calendar {date} on:select={select} />
    <Listview {list} />
  </div>
</template>
