<script lang="ts">
  import Calendar from '../components/Calendar.svelte'
  import {getService} from '../services/io'
  import {DateTime} from 'luxon'
  const agnService=getService('agntermine')
  let date: Date = new Date()
  function select(event) {
    const date=event.detail
    agnService.find({query:{
      tag: DateTime.fromJSDate(date).toFormat("yyyyLLdd"),
      deleted: "0"
    }})
  }
</script>

<template>
  <Calendar {date} on:{select} />
</template>
