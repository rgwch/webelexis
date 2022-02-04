<script lang="ts">
  import DatePicker from "../components/DatePicker.svelte";
  import {TerminManager, TerminModel, type TerminType} from '../models/termine-model'
  const tm=new TerminManager()

  let list: Array<TerminModel> = [];
  function select(event) {
    const date = event.detail;
    tm.fetchForDay(date,"gerry").then(result=>{
      list=result
    })
    
  }
</script>

<template>
  <div class="flex">
    <DatePicker on:select={select} keepOpen={true} />
    <div class="flex-auto">
      <ul>
        {#each list as tm}
          <li style="background-color:{tm.getStateColor()}">
            {#await tm.getLabel()}
              loading...
            {:then label}
              {label}
            {/await}
          </li>
        {/each}
      </ul>
    </div>
  </div>
</template>
