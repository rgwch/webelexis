<script lang="ts">
  import Calendar from '../components/Calendar.svelte'
  import {getService} from '../services/io'
  const agnService=getService('agntermine')
  let date: Date = new Date()
  function select(event) {
    const date=event.detail
  }
</script>

<template>
  <Calendar {date} on:{select} />
</template>
