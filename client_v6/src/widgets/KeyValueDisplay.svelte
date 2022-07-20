<script lang="ts">
  import {createEventDispatcher} from 'svelte'
  const dispatch = createEventDispatcher()
  export let obj = {};
  export let keys=[]
  
  for(const key of keys){
    if(!obj[key]){
      obj[key]=""
    }
  }
</script>

<template>
  <div class="scrollpanel w-full">
    <table>
    {#each Object.keys(obj) as key}
      {#if typeof obj[key] === "string"}
        <tr>
          <td>{key}</td>
          <td><input type="text" value={obj[key]} on:blur="{()=>{dispatch("textChanged")}}"/></td>
        </tr>
      {/if}
    {/each}
  </table>
  </div>
</template>
