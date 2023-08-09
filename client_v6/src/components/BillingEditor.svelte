<script lang="ts">
  import type { EncounterType } from "../models/encounter-model";
  import {currentEncounter} from '../services/store'
  import BillingSelector from "./BillingSelector.svelte";
  import {leistungsblockManager as lbm} from '../models/leistungsblock-model'
  import {billingsManager as bm, type BillingType} from '../models/billings-model'
  import Fa from "svelte-fa";
  import { faPlusSquare, faMinusSquare,faTimesSquare } from "@fortawesome/free-solid-svg-icons";
  let dragging=false
  let billings: Array<BillingType> = [];
  let selectedBilling=undefined;
  $: bm.getBillings($currentEncounter?.id).then(result=>{
    billings=result
  })
  function dragover(event){
    event.preventDefault()
    dragging=true
    return true;
  }
  function dragleave(event){
    dragging=false
    return true;
  }
  function dragdrop(event){
    event.preventDefault()
    const data = event.dataTransfer.getData("text");
    if (data.startsWith("block")) {
      lbm
        .applyBlock(data.substring("block!".length), this.kons, this.billings)
        .then(block => {
          billings=billings
        });
    } else {
      bm.getBillable(data).then(billable => {
        bm
          .createBilling(billable, $currentEncounter, 1, billings)
          .then(async billing => {
            billings=billings
          })
          .catch(err => {
            alert("could not create Billing " + err);
          });
      });
    }
    dragging=false;
    return true;

  }
  function increase(){
    if(selectedBilling){
      selectedBilling.zahl++
      billings=billings
    }
  }
  function decrease(){
    if(selectedBilling){
      selectedBilling--
      if(selectedBilling<=0){
        remove();
      }
      billings=billings
    }
  }
  function remove(){

  }
</script>

<template>
  <div class="flex flex-col">
    <div class="overflow-auto h-60">
      <BillingSelector />
    </div>
    <div
      class="border-blue-300 border-2 p-1 mt-4 min-h-20 overflow-auto"
      class:dragging={"bg-red-100"}
      on:dragover={dragover}
      on:dragleave={dragleave}
      on:drop={dragdrop}
    >
      <div>
        <button class="edit" on:click={increase}
          ><Fa icon={faPlusSquare} /></button
        >
        <button class="edit" on:click={remove}
          ><Fa icon={faTimesSquare} /></button
        >
        <button class="edit" on:click={decrease}
          ><Fa icon={faMinusSquare} /></button
        >
      </div>
      <div>
        {#each billings as item}
          <p
            class="text-sm {selectedBilling == item
              ? 'text-blue-800'
              : 'text-black-900'} cursor-pointer"
            on:click={() => {
              selectedBilling = item;
            }}
          >
            {item.zahl}&nbsp;
            {bm.getCode(item)}&nbsp;
            {item.leistg_txt}
          </p>
        {/each}
      </div>
    </div>
  </div>
</template>

<style>
  .edit {
    margin: 2px;
    padding-left: 2px;
  }
</style>
